const createTestCafe = require("testcafe");
let testcafe = null;

createTestCafe("localhost", 1337, 1338)
  .then(tc => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src(["testcafe/tests/photos_crud.js"])
      .browsers(["firefox:headless"])
      .screenshots(
        "reports/screenshots/",
        true,
        "${DATE}_${TIME}_${FILE_INDEX}.png"
      )
      .run();
  })
  .then(failedCount => {
    console.log("Tests failed: " + failedCount);
    testcafe.close();
  });
