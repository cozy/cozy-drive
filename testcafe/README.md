# Cozy TestCafe

[Testcafe](https://devexpress.github.io/testcafe/) is not used anymore for automated testing on Travis.

To run local test using testcafe, you must first set some environment variables.

```console
export TESTCAFE_PHOTOS_URL="your Cozy Photos-url" #ie: https://username-photos.mycozy.cloud/
export TESTCAFE_USER_PASSWORD="your password"
```

Then, in your git folder, use node to run our tests set :

```console
yarn testcafe:photos
yarn testcafe:drive
```

In files `testcafe/runner_*.js`, you can modify

```js
.browsers(['firefox:headless'])
```

to remove `:headless` and "see" the test happening
