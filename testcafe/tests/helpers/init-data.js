import { extractZip, prepareFilesforViewerTest } from './utils'
import { DATA_ZIP_PATH, DATA_PATH, FILE_FROM_ZIP_PATH } from './data'

fixture`Init files used in tests`

test('Unzip archive containing files used for testing', async () => {
  await extractZip(DATA_ZIP_PATH, DATA_PATH)
})

test('Prepare the unzipped files for testing', async () => {
  //set path needed to use data in tests
  await prepareFilesforViewerTest(FILE_FROM_ZIP_PATH)
})
