const createTestCafe = require('testcafe')
const selfSignedSertificate = require('openssl-self-signed-certificate')

const sslOptions = {
  key: selfSignedSertificate.key,
  cert: selfSignedSertificate.cert
}

async function runRunner() {
  const tc = await createTestCafe('localhost', 1337, 1338, sslOptions)
  const runner = await tc.createRunner()
  const response = await runner
    .src(['testcafe/tests/drive_nav.js', 'testcafe/tests/drive_sharing.js'])
    .browsers([
      'chrome --allow-insecure-localhost --allow-running-insecure-content --start-maximized'
    ])

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
