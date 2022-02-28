# Drive Mobile version

## :boat: Compile yourself

### :wrench: Requirements

- Node 12
  - on macOS: `brew install node@12 && brew link node@12`
- ImageMagick
  - on macOS: `brew install imagemagick`
- Cordova 8.1.2 CLI - [documentation here](https://cordova.apache.org/docs/en/8.x/reference/cordova-cli/index.html)
  - `yarn add cordova@8.1.2 -g`

#### Android

- Android SDK 30.0.3
  - Install Android Studio
  - Go to SDK Manager (Create new project if necessary)
  - Install SDK (edit Android SDK location if necessary - should be `~/Library/Android/sdk`)
  - Accept license agreements by running: `~/Library/Android/sdk/tools/bin/sdkmanager --licenses`
- JDK 8
  - on macOS: `brew tap adoptopenjdk/openjdk && brew install --cask adoptopenjdk8`
- Gradle
  - on macOS: `brew install gradle`
- Define your ANDROID_HOME
  - Add `export ANDROID_HOME="$HOME/Library/Android/sdk"` in your `.zshrc` or `.bashrc`
- Define your JAVA_HOME
  - Add `export JAVA_HOME=$(/usr/libexec/java_home)` in your `.zshrc` or `.bashrc` file
- Add Android build-tools in your Path
  - Add `export PATH="$ANDROID_HOME/build-tools/$(ls $ANDROID_HOME/build-tools | sort -V | tail -n 1):$PATH"` in your `.zshrc` or `.bashrc` file
  - Adding `export PATH="$ANDROID_HOME/platform-tools:$PATH"` can be useful too to get tools such as `adb`, but not necessary


#### Android > 9

To build for android version > 9 you need to add a specific config line in `config.xml`

- Inside `<edit-config file="app/src/main/AndroidManifest.xml" [...]></edit-config>`, add `<application android:usesCleartextTraffic="true" />`

#### iOS

- Xcode >= 8.1

### :package: Install and prepare

```sh
$ git clone https://github.com/cozy/cozy-drive.git
$ cd cozy-drive
$ yarn install
$ yarn genicon:drive:mobile
$ yarn build:drive:mobile
$ yarn prepare:drive:mobile
```

If it's not a fresh install, remove old folders first :

```sh
$ rm -f src/drive/targets/mobile/yarn.lock && rm -rf src/drive/targets/mobile/node_modules && rm -rf src/drive/targets/mobile/build && rm -rf src/drive/targets/mobile/platforms && rm -rf src/drive/targets/mobile/plugins && rm -rf src/drive/targets/mobile/www && rm -rf src/drive/targets/mobile/ul_web_hooks
```

### :helicopter: Run

After that, you need to run to build native and js files and deploy them on the simulator :

```sh
$ yarn run:drive:[android || ios]
```

You can also do that manually :

On Android:

```sh
$ cd src/drive/targets/mobile
$ cordova run android
```

On iOS:

Open the src/drive/targets/mobile/platforms/ios/Cozy Drive.xcworkspace in Xcode, update the Swift syntax if needed, set your signing certificate on the target (if you're testing on a device), then:

```sh
$ npm install -g ios-deploy
$ cd src/drive/targets/mobile
$ cordova run ios
```

### :loop: Run in dev mode

Only js files are build in dev mode. So don't forget to `run` first (see the section above).

There is 3 ways to run in dev mode :

- watch with cold reload
- start with hot reload (HMR - hot module replacement)
- standalone mode

#### Watch with cold reload

```sh
$ yarn watch:drive:mobile
```

#### HMR mode on a smartphone

You need to export your local host IP address

```sh
$ export DEV_HOST=[YOUR_LOCAL_IP_ADDRESS]
```

Then you have to watch in `hot` mode:

```sh
$ yarn start:drive:mobile
```

#### Standalone mode

- Open your browser with web-security CORS disabled.

Brave:
```sh
$ open -n -a /Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```
Chrome:
```sh
$ open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

- After verifying that your app has been built, launch `$ yarn start:drive:standalone`
- Go to http://localhost:8888 in your browser, or check the `Dev assets` in the top of the yarn console
- Follow the onboarding and after giving your own cozy URL, click on the link logged in the bottom of the browser console (similar to http://cozy.localhost:8080/auth/authorize?client_id={CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost&state={STATE}&response_type=code&scope=)
- Log yourself, accept permissions by clicking on "AUTORIZE" and copy the url you've been redirected to (similar to http://localhost/?access_code={ACCESS_CODE}&code={CODE}&fallback=https%3A%2F%2F{COZY_USER_NAME}-drive.mycozy.cloud%2F&state={STATE}#)
- Return to your previous tab and paste the url in the prompt (be quick, or take your time, whatever, because the prompt may be blocked when it pops if you're still on the permissions tab)

## :iphone: Launch the simulator

On iOS:

- Open the project in Xcode : `open "src/drive/targets/mobile/platforms/ios/Cozy Drive.xcodeproj"`
- Select "Cozy Drive" app and the device you want
- Click "Play" button

:warning: Be sure you have only one `ShareExt` in your `TARGETS` (you can check this in the main screen of Xcode)

## :lock: Create Release

### Get translations first

Before building the application, you need to get the translations:

```sh
$ yarn tx
```

### Android

#### Requirements

You must have `cozy-drive-release-key.jks` and `key.json` in `src/drive/targets/mobile/keys/android`

Assuming your password folder is `~/.password-store` and Drive folder is `~/workspace/cozy-drive`

```sh
$ mkdir -p ~/workspace/cozy-drive/src/drive/targets/mobile/keys/android/
$ cd ~/.password-store
$ pass Mobile/Android/fastlane/cozy-drive-release-key.jks > ~/workspace/cozy-drive/src/drive/targets/mobile/keys/android/cozy-drive-release-key.jks
$ pass Mobile/Android/fastlane/key.json > ~/workspace/cozy-drive/src/drive/targets/mobile/keys/android/key.json
```

and the password associated with `cozy-drive-release-key.jks`

```sh
$ pass Mobile/Android/fastlane/jks-passphrase
```

#### Generate a signed APK

```sh
$ yarn buildsigned:drive:android
```

The signed APK will be generated here: `src/drive/targets/mobile/build/android/cozy-drive.apk`

#### Publish a test version on Google Play

- Go to [Google Play Console](https://play.google.com/console) and select `Drive` app
- To publish an internal testing version: go to `Release > Testing > Internal testing`
- Now you have to `Create a new release`, upload your APK, then `Save`, `Review release` and finally `Start rollout`

#### Publish a new release

- If the internal testing version is validated, go to [Google Play Console](https://play.google.com/console) then `Release > Testing > Internal testing`. For the release you want to publish, click `Promote release` and select `Production`
- Check that the version of the chosen APK is the right one
- Add the `Release notes` in English and French : take example on the previous version on [Google Play](https://play.google.com/store/apps/details?id=io.cozy.drive.mobile) or in the Google Play Console
- Click `Review release`

### iOS

Be sure you have `run` at least once, then open the project in Xcode:

```sh
$ yarn run:drive:ios
$ open "src/drive/targets/mobile/platforms/ios/Cozy Drive.xcodeproj"
```
#### Xcode configuration

- In `General` tab, check the `Version` and `Build version` for the Cozy Drive and ShareExt targets. They must be the same as in the `config.xml`. If not, restart Xcode.
- Next to the "play button", select `Drive > Build - Any iOS Device`
- For `Cozy Drive` and `ShareExt` targets, in `Signing & Capabilities > Signing`: (for debug and release)
  - check `Automatically manage signing`
  - in `Team` select `Cozy Cloud`
- For `Cozy Drive` and `ShareExt` targets, in `Signing & Capabilities > App Groups`: (add it if not present)
  - check `groupe.io.cozy.drive.mobile.shareextension`
- For `Cozy Drive project`, `Cozy Drive` and `ShareExt` targets, in `Build Settings > Signing`:
  - in `Code Signing Identity` select `Apple Developpment`
  - in `Signing Style` and `Provisioning Profile` select `Automatic`

#### Build and Publish a test version on App Store

- In Xcode menu, select `Product` then `Archive`. When the build is finished, select it, click `Distribute App` then `App Store Connect > Upload > Accept receiving symbolicated reports > Automatic signin`
- Check the ShareExt is present then click `Upload`
- Go to [App Store Connect](https://appstoreconnect.apple.com/) and `My apps > Cozy Drive > TestFlight` to verify the upload has worked properly

#### Publish a new release

- In the [App Store Connect](https://appstoreconnect.apple.com/), click the "+" button near `App iOS`
- Add the changelog in English and French : take example on the previous version on [App Store](https://apps.apple.com/us/app/cozy-drive/id1224102389) or in the App Store Connect
- Add the desired `Build`
- Click `Submit for verification`
- After the verification is done by Apple, you will have to publish yourself manually


# For further informations

## :rainbow: Icons & Splashscreen

You can generate all icons with [splashicon-generator](https://github.com/eberlitz/splashicon-generator).

```sh
$ yarn genicon:drive:mobile
```

## :repeat: CI

Travis CI can automatically build a signed APK for Pull Requests. To trigger a build, simply add the text `[APK]` somewhere in the commit message.

### Icon

Should be a 1024x1024px.

- `mobile/res/model/icon.png`. On iOS add 5% margin
- `mobile/res/model/android/icon.png`. Override the default icon for the 'android' platform. So you can use an icon with alpha, as apple doesn't allow it.

### Splashscreen

Your splash must be 2732x2732px as it now is the largest resolution (used by iPad Pro 12.9"), and the artwork should fit a center square (1200x1200px). This Photoshop splash screen template provides the recommended size and guidelines of the artwork’s safe zone.

- `mobile/res/model/splash.png`

## :newspaper_roll: Uploading sourcemaps to Sentry

First, you will need to create a `.sentryclirc` file in `~/` that will contain the following data:

```
[defaults]
url=https://sentry.cozycloud.cc/
project=cozy-drive-dev
org=sentry
[auth]
token = {token}
```

Replace `{token}` with a token that you can generate by going to [this page](https://sentry.cozycloud.cc/api/) (Profile -> API). The token should have the `project:write` and `project:releases` permissions.

Once the file is created, and after you've ran the proper build commands, you can upload the sourcemaps with

```sh
$ yarn sentry:drive:mobile
```
