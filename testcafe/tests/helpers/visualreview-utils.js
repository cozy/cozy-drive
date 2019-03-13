import VisualReview from 'visualreview-client'
import { t } from 'testcafe'
import { getNavigatorOs, getNavigatorName, getResolution } from './utils'

//Put this const in travis after POC
const VISUALREVIEW_INSTANCE = 'visualreview.cozycloud.cc'

export class VisualReviewTestcafe extends VisualReview {
  constructor(options) {
    super(options)
    this.options.protocol = 'https'
    this.options.hostname = VISUALREVIEW_INSTANCE
  }

  async takeScreenshotAndReview(imageName) {
    await t.takeScreenshot(imageName)

    this.options.properties.os = await getNavigatorOs()
    this.options.properties.browser = await getNavigatorName()
    this.options.properties.resolution = await getResolution()

    //the path needs to be in const but i need to define the screenshots tree 1st
    this.uploadScreenshot('./reports/screenshots/' + imageName)
  }

  async checkVr() {
    let runAnalysis = await this.getJsonStatusForCurrentRun()
    let runStatus = 'accepted'

    for (let imgDiff in runAnalysis.diffs) {
      if (runAnalysis.diffs[imgDiff].status != 'accepted') {
        runStatus = runAnalysis.diffs[imgDiff].status
        throw new Error(
          `❌ Screenshots changes  in image ID ${
            runAnalysis.diffs[imgDiff].id
          } (${runAnalysis.diffs[imgDiff].status}), please Review :  ${
            this.options.protocol
          }://${this.options.hostname}/#/${runAnalysis.analysis.projectId}/${
            runAnalysis.analysis.suiteId
          }/${runAnalysis.analysis.runId}`
        )
      }
    }
    console.log(`Screenshots status : ${runStatus}`)
  }
}
