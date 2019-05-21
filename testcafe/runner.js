const createTestCafe = require('testcafe')
const postCommentToGithub = require('./tests/helpers/comment-on-github.js')

async function runRunner(testsArray) {
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
    .src(testsArray)
    //emulation:cdpPort=9222 is used to set the download folder in headless mode
    .browsers(['chrome:headless:emulation:cdpPort=9222 --start-maximized'])

    .screenshots(
      'reports/',
      true,
      '${DATE}_${TIME}/${FIXTURE}/${TEST_ID}-${TEST}/${FILE_INDEX}.png'
    )
    .run({
      assertionTimeout: 8000, //Testcafe Default value: 3000
      pageLoadTimeout: 6000, //Testcafe Default value: 3000
      selectorTimeout: 15000, //Testcafe Default value: 10000
      skipJsErrors: true,
      skipUncaughtErrors: true
    })
  tc.close()

  if (response > 0) throw Error(response)
}

module.exports = async function(testsArray) {
  process.env.vrErrorMsg = ''
  for (const test of testsArray) {
    await runRunner(test)
  }

  await postCommentToGithub()
}
