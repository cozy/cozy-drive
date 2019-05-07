import VisualReview from 'visualreview-client'
import logger from './logger'
import { t } from 'testcafe'
import { VR_STATUS_DELAY, VR_UPLOAD_DELAY } from './data'
import {
  getNavigatorOs,
  getNavigatorName,
  getResolution,
  checkAllImagesExists
} from './utils'

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

  //@param { path } screenshotPath - mandatory
  //@param { mask (or false) } withMask : set a mask for screenshot
  //@param { selector } selector : set if we want a screenshot on an element rather than the whole page
  //@param { interger (ms) } delay
  //@param { page } pageToWait : when using delay, the current page is reload so we need a page object for `waitForLoading`
  async takeScreenshotAndUpload({
    screenshotPath: screenshotPath,
    withMask = false,
    selector = false,
    delay = false,
    pageToWait = false
  }) {
    //Delay (need to have a page to wait)
    if (delay && pageToWait) {
      //add wait to avoid thumbnail error on screenshots
      await t.wait(delay)
      //relaod page to load thumbnails
      await t.eval(() => location.reload(true))
      await checkAllImagesExists()
      await pageToWait.waitForLoading()
    }
    //set Mask
    if (withMask) {
      await this.setMaksCoordonnates(withMask)
    } else {
      await this.resetMask()
    }

    this.options.properties.os = await getNavigatorOs()
    this.options.properties.browser = await getNavigatorName()
    this.options.properties.resolution = await getResolution()

    if (selector) {
      await t.takeElementScreenshot(selector, `${screenshotPath}.png`)
    } else {
      await t.takeScreenshot(`${screenshotPath}.png`)
    }

    //VisualReview doesn't handle timeout, so lets add a timeout here to avoid breaking the CI
    Promise.race([
      this.uploadScreenshot(`./reports/${screenshotPath}.png`),
      new Promise(function(resolve, reject) {
        setTimeout(
          () =>
            reject(
              new Error(`❌ VisualReview - "${screenshotPath}.png" timeout`)
            ),
          VR_UPLOAD_DELAY
        )
      })
    ]).then(
      function() {
        logger.debug(`➡️ "${screenshotPath}.png" uploaded`)
      },
      function(error) {
        //log error instead of throwing error so tests don't crash if VR server is taking too long
        logger.error(error.message)
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
      logger.warn(`Please review screenshot(s) : ${vrMessageUrl}`)
    } else {
      logger.info(
        `✅ ${runAnalysis.analysis.projectName} : ${
          runAnalysis.analysis.suiteName
        } : Screenshots accepted`
      )
    }
  }
}
