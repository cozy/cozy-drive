import VisualReview from 'visualreview-client'
import { t } from 'testcafe'
import { getNavigatorOs, getNavigatorName, getResolution } from './utils'

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

    //the path needs to be in const but i need to define the screenshots tree 1st
    this.uploadScreenshot(`./reports/${screenshotsPath}.png`)
  }

  async checkRunStatus() {
    //this function is called in .after, so we cannot use t.wait(5000)
    //Needs modifications on server side to avoid delay
    const delay = ms => new Promise(res => setTimeout(res, ms))
    await delay(3000)

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

      throw new Error(vrMessageUrl)
    } else {
      console.log(`Screenshots status : accepted`)
    }
  }
}
