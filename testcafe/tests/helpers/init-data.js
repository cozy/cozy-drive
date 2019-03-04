import { extractZip, prepareFilesforViewerTest } from './utils'
let data = require('../helpers/data')

fixture`Init Data`

test('Unzip Data', async () => {
  await extractZip(data.DATA_ZIP_PATH, data.DATA_PATH)
})

test('Prepare Data', async () => {
  //set path needed to use data in tests
  await prepareFilesforViewerTest(data.FILE_FROM_ZIP_PATH)
})
