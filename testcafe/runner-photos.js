const createTestCafe = require('testcafe')
const postCommentToGithub = require('./tests/helpers/comment-on-github.js')

async function runRunner() {
  //init vrErrorMsg
  process.env.vrErrorMsg = ''

  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src([
      //Scenario that just upload photos, so we don't need to do it in every test.
      'testcafe/tests/photos/photos_start_upload_photos.js',

      'testcafe/tests/photos/photos_crud.js',
      'testcafe/tests/photos/create_full_album_scenario.js',
      'testcafe/tests/photos/create_empty_album_scenario.js',
      'testcafe/tests/photos/album_sharing_scenario.js',

      //Scenario that just delete photos, so we don't need to do it in every test.
      'testcafe/tests/photos/photos_end_delete_all_data.js'
    ])
    //emulation:cdpPort=9222 is used to set the download folder in headless mode
    .browsers([
      'chrome:headless:emulation:cdpPort=9222 --start-maximized --disable-dev-shm-usage'
    ])

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
