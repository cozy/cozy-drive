const createTestCafe = require('testcafe')

async function runRunner() {
  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src([
      //Scenario that just upload photos, so we don't need to do it in every test.
      'testcafe/tests/photos/photos_start_upload_photos.js',

      'testcafe/tests/photos/photos_crud.js',
      'testcafe/tests/photos/create_full_album_scenario.js',
      'testcafe/tests/photos/create_empty_album_scenario.js',

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

  if (response > 0) throw Error(response)
}

runRunner()
