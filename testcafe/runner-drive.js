const createTestCafe = require('testcafe')
const postCommentToGithub = require('./tests/helpers/comment-on-github.js')

async function runRunner() {
  //init vrErrorMsg
  process.env.vrErrorMsg = ''
  if (!process.env.INSTANCE_TESTCAFE || !process.env.TESTCAFE_USER_PASSWORD) {
    throw Error(
      `You have to provide INSTANCE_TESTCAFE & TESTCAFE_USER_PASSWORD
      Exemple:
      export INSTANCE_TESTCAFE="cozy.tools:8080"
      export TESTCAFE_USER_PASSWORD="foo" `
    )
  }
  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src([
      //Init data : Unzip archive with files to upload
      'testcafe/tests/helpers/init-data.js',
      //Tests !
      'testcafe/tests/drive/classification_scenario.js',
      'testcafe/tests/drive/navigation.js',
      'testcafe/tests/drive/folder_sharing_scenario.js',
      'testcafe/tests/drive/file_sharing_scenario.js',
      'testcafe/tests/drive/viewer-feature.js',
      'testcafe/tests/drive/public-viewer-feature.js'
    ])
    //emulation:cdpPort=9222 is used to set the download folder in headless mode
    .browsers(['chrome:headless:emulation:cdpPort=9222 --start-maximized'])

    .screenshots(
      'reports/',
      true,
      '${DATE}_${TIME}/test-${TEST}-${FILE_INDEX}.png'
    )
    .run({
      assertionTimeout: 6000,
      pageLoadTimeout: 6000,
      skipJsErrors: true,
      skipUncaughtErrors: true
    })
  tc.close()

  await postCommentToGithub()

  if (response > 0) throw Error(response)
}

runRunner()
