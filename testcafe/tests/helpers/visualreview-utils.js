import VisualReview from 'visualreview-client'
import { t } from 'testcafe'

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

    //the path needs to be in const but i need to define the screenshots tree 1st
    this.uploadScreenshot('./reports/screenshots/' + imageName)
  }
}
