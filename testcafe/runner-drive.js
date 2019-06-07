const runAllTests = require('./runner')
const tests = [
  //Init data : Unzip archive with files to upload
  ['testcafe/tests/drive/init-data.js'],
  //Tests !
  ['testcafe/tests/drive/upload-conflicts.js'],
  ['testcafe/tests/drive/classification_scenario.js'],
  ['testcafe/tests/drive/navigation.js'],
  ['testcafe/tests/drive/folder_sharing_scenario.js'],
  ['testcafe/tests/drive/file_sharing_scenario.js'],
  ['testcafe/tests/drive/viewer-feature.js'],
  ['testcafe/tests/drive/public-viewer-feature.js'],
  ['testcafe/tests/drive/search.js'],
  //cleanup
  ['testcafe/tests/drive/clean-data.js']
]

runAllTests(tests)
