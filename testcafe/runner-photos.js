const createTestCafe = require("testcafe");
let testcafe = null;

createTestCafe("localhost", 1337, 1338)
  .then(tc => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return (
      runner
        .src(["testcafe/tests/photos_crud.js"])
        //.src(["testcafe/tests/tmp.js"])

        .browsers(["firefox:headless"])
        //.browsers(["firefox"])

        .screenshots(
          "reports/screenshots/",
          true,
          "${DATE}_${TIME}_/test-${TEST_INDEX}-${FILE_INDEX}.png"
        )
        .run(
          //  { selectorTimeout: 200000 },
          { assertionTimeout: 6000 },
          { pageLoadTimeout: 6000 }
        )
    );
  })
  .then(failedCount => {
    console.log("Tests failed: " + failedCount);
    testcafe.close();
  });
