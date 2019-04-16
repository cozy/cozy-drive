import VisualReview from 'visualreview-client'
import { t } from 'testcafe'
import { getNavigatorOs, getNavigatorName, getResolution } from './utils'
import { VR_STATUS_DELAY, VR_UPLOAD_DELAY } from './data'

//Put this const in travis after POC
const VISUALREVIEW_INSTANCE = 'visualreview.cozycloud.cc'

export const PRECISION = 40
export async function initVR(ctx, projectName, suiteName) {
  ctx.vr = new VisualReviewTestcafe({
    //    debug: true,
    projectName: `${projectName}`,
    suiteName: `${suiteName}`
  })
  await ctx.vr.start()
  ctx.isVR = true
}

export class VisualReviewTestcafe extends VisualReview {
  constructor(options) {
    super(options)
    this.options.protocol = 'https'
    this.options.hostname = VISUALREVIEW_INSTANCE
    this.options.compareSettings = {
      precision: PRECISION //precision goes from 0 to 255
    }
    this.options.mask = {}
  }

  //@param { jsonObject } masK { x, y, width, height } : coordonate for mask. order is the same in gimp rectangle selection
  async setMaksCoordonnates(maskCoordonates) {
    this.resetMask()
    this.options.mask = {
      excludeZones: [
        {
          height: maskCoordonates.height,
          x: maskCoordonates.x,
          width: maskCoordonates.width,
          y: maskCoordonates.y
        }
      ]
    }
  }

  async resetMask() {
    this.options.mask = {}
  }

  async takeScreenshotAndUpload(screenshotsPath, hasMask = false) {
    if (!hasMask) {
      //re-init mask
      this.resetMask()
    }

    await t.takeScreenshot(`${screenshotsPath}.png`)

    this.options.properties.os = await getNavigatorOs()
    this.options.properties.browser = await getNavigatorName()
    this.options.properties.resolution = await getResolution()

    //VisualReview doesn't handle timeout, so lets add a timeout here to avoid breaking the CI
    Promise.race([
      this.uploadScreenshot(`./reports/${screenshotsPath}.png`),
      new Promise(function(resolve, reject) {
        setTimeout(
          () =>
            reject(
              new Error(`❌ VisualReview - "${screenshotsPath}.png" timeout`)
            ),
          VR_UPLOAD_DELAY
        )
      })
    ]).then(
      function() {
        console.log(`➡️ "${screenshotsPath}.png" uploaded`)
      },
      function(error) {
        //log error instead of throwing error so tests don't crash if VR server is taking too long
        console.log(error.message)
      }
    )
  }

  async takeElementScreenshotAndUpload(
    selector,
    screenshotsPath,
    hasMask = false
  ) {
    if (!hasMask) {
      //re-init mask
      this.resetMask()
    }
    //always wait for 1s before taking screenshots
    await t.takeElementScreenshot(selector, `${screenshotsPath}.png`)

    this.options.properties.os = await getNavigatorOs()
    this.options.properties.browser = await getNavigatorName()
    this.options.properties.resolution = await getResolution()
    //VisualReview doesn't handle timeout, so lets add a timeout here to avoid breaking the CI
    Promise.race([
      this.uploadScreenshot(`./reports/${screenshotsPath}.png`),
      new Promise(function(resolve, reject) {
        setTimeout(
          () =>
            reject(
              new Error(`❌ VisualReview - "${screenshotsPath}.png" timeout`)
            ),
          VR_UPLOAD_DELAY
        )
      })
    ]).then(
      function() {
        console.log(`➡️ "${screenshotsPath}.png" uploaded`)
      },
      function(error) {
        console.log(error.message)
      }
    )
  }

  async checkRunStatus() {
    //this function is called in .after, so we cannot use t.wait(VR_STATUS_DELAY)
    //Needs modifications on server side to avoid delay
    const delay = ms => new Promise(res => setTimeout(res, ms))
    await delay(VR_STATUS_DELAY)

    let runAnalysis = await this.getJsonStatusForCurrentRun()
    if (
      runAnalysis.diffs.filter(element => element.status != 'accepted').length >
      0
    ) {
      const vrMessageUrl = `❌ ${runAnalysis.analysis.projectName} : ${
        runAnalysis.analysis.suiteName
      } :  ${this.options.protocol}://${this.options.hostname}/#/${
        runAnalysis.analysis.projectId
      }/${runAnalysis.analysis.suiteId}/${runAnalysis.analysis.runId}`

      process.env.vrErrorMsg = `${
        process.env.vrErrorMsg
      } <li>${vrMessageUrl}</li>`
      console.log(`${vrMessageUrl}`)
    } else {
      console.log(
        `✅ ${runAnalysis.analysis.projectName} : ${
          runAnalysis.analysis.suiteName
        } : Screenshots accepted`
      )
    }
  }
}
