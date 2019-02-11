const createTestCafe = require('testcafe')

async function runRunner() {
  const tc = await createTestCafe()
  const runner = await tc.createRunner()
  const response = await runner
    .src(['testcafe/tests/drive_nav.js', 'testcafe/tests/drive_sharing.js'])
    .browsers(['chrome:headless:emulation:cdpPort=9222 --start-maximized']) //emulation:cdpPort=9222 is used to set the download folder in headless mode

    .screenshots(
      'reports/screenshots/',
      true,
      '${DATE}_${TIME}/test-${TEST_INDEX}-${FILE_INDEX}.png'
    )
    .run({ assertionTimeout: 6000 }, { pageLoadTimeout: 6000 })
  tc.close()

  if (response > 0) throw Error(response)
}

runRunner()
