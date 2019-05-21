const runAllTests = require('./runner')
const tests = [
  //Scenario that just upload photos, so we don't need to do it in every test.
  ['testcafe/tests/photos/photos_start_upload_photos.js'],

  ['testcafe/tests/photos/photos_crud.js'],
  ['testcafe/tests/photos/album_sharing_scenario.js'],
  ['testcafe/tests/photos/create_empty_album_scenario.js'],
  ['testcafe/tests/photos/create_full_album_scenario.js'],

  //Scenario that just delete photos, so we don't need to do it in every test.
  'testcafe/tests/photos/photos_end_delete_all_data.js'
]

runAllTests(tests)
