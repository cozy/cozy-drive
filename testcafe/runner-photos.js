const createTestCafe = require('testcafe')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function runRunner() {
  //init vrErrorMsg
  process.env.vrErrorMsg = ''

  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src([
      //Scenario that just upload photos, so we don't need to do it in every test.
      'testcafe/tests/photos/photos_start_upload_photos.js',

      // 'testcafe/tests/photos/photos_crud.js',
      // 'testcafe/tests/photos/create_full_album_scenario.js',
      // 'testcafe/tests/photos/create_empty_album_scenario.js',
      //
      //Scenario that just delete photos, so we don't need to do it in every test.
      'testcafe/tests/photos/photos_end_delete_all_data.js'
    ])
    .browsers(['chrome:headless --start-maximized']) //no need for emulation:cdp for now in photos

    .screenshots(
      'reports/screenshots/',
      true,
      '${DATE}_${TIME}/test-${TEST}-${FILE_INDEX}.png'
    )
    .run({ assertionTimeout: 6000 }, { pageLoadTimeout: 6000 })
  tc.close()

  //do not try to post to git when using locally
  if (
    typeof process.env.TRAVIS_PULL_REQUEST !== 'undefined' &&
    process.env.TRAVIS_PULL_REQUEST &&
    process.env.vrErrorMsg != ''
  ) {
    const message = `Visual Review - Please review screenshots, then restart build. ${
      process.env.vrErrorMsg
    }`
    await exec(`yarn run cozy-ci-github "${message}"`)
  }
  if (response > 0) throw Error(response)
}

runRunner()
