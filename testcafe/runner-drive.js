const createTestCafe = require('testcafe')

async function runRunner() {
  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src([
      //Init data : Unzip archive with files to upload
      'testcafe/tests/helpers/init-data.js',

      //Tests !
      'testcafe/tests/drive/navigation.js',
      'testcafe/tests/drive/folder_sharing_scenario.js',
      'testcafe/tests/drive/file_sharing_scenario.js',
      'testcafe/tests/drive/viewer-feature.js'
    ])
    //emulation:cdpPort=9222 is used to set the download folder in headless mode
    .browsers(['chrome:headless:emulation:cdpPort=9222 --start-maximized'])

    .screenshots(
      'reports/',
      true,
      '${DATE}_${TIME}/test-${TEST}-${FILE_INDEX}.png'
    )
    .run({ assertionTimeout: 6000 }, { pageLoadTimeout: 6000 })
  tc.close()

  if (response > 0) throw Error(response)
}
runRunner()
