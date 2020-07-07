# Drive Mobile version

## :boat: Compile yourself

### :wrench: Requirements

- Node v8 (on macOS: `brew install node@8 && brew link node@8`)
- ImageMagick (on macOS: `brew install imagemagick`)
- Android SDK >= 25.0.0 to deploy on android
- Xcode 8.1 >= to deploy on ios
- Cordova v7 CLI (`npm install cordova@7 -g`)

### :package: Install and run in dev mode

```sh
$ git clone https://github.com/cozy/cozy-drive.git
$ cd cozy-drive
$ yarn install
```

mobile specific:

```sh
$ yarn genicon:drive:mobile
$ yarn build:drive:mobile
$ yarn prepare:drive:mobile
```

or if you develop :loop::

```sh
$ yarn watch:drive:mobile
```

### :helicopter: Deploy

After that, you can deploy with one of these commands:

On Android:

```sh
$ cd src/drive/targets/mobile
$ cordova run android
```

On iOS: open the src/drive/targets/mobile/platforms/ios/Cozy Drive.xcworkspace in Xcode, update the Swift syntax if needed, set your signing certificate on the target (if you're testing on a device), then:

```sh
$ npm install -g ios-deploy
$ cd src/drive/targets/mobile
$ cordova run ios
```

### HMR mode on a smartphone

You need to export your local host IP address

```sh
export DEV_HOST=10.1.3.252
```

Then you have to watch in `hot` mode:

```sh
yarn watch:drive:mobile:hot
```

Once the previous command is finished a first time then run on Android / iOS :

```sh
yarn run:drive:android
```

Enjoy

### Standalone mode

- Open your browser with web-security CORS disabled
- launch `$ yarn watch:mobile:standalone`
- Go to localhost:8084 in your browser and open the console
- Follow the onboarding and after giving your cozy URL, click on the link logged in the console
- Log yourself, accept permissions and copy the url you've been redirected to.
- Return to your previous tab and paste the url in the prompt (be quick, or take your time, whatever, because the prompt may be blocked when it pops if you're still on the permissions tab)
- Profit!

## :lock: Create Release

### Android

Create these folders:

```
$ mkdir src/drive/targets/mobile/keys
$ mkdir src/drive/targets/mobile/keys/android
$ mkdir src/drive/targets/mobile/build
$ mkdir src/drive/targets/mobile/build/android
```

You must have this files:

- keys/android/cozy-drive-release-key.jks (and the password)
- keys/android/key.json

To generate a signed APK on `src/drive/targets/mobile/build/android/` and publish on Google Play:

```
$ npm run buildsigned:drive:android
$ npm run publish:drive:android
```

Or if you want to publish the release on the beta track:

```
$ npm run buildsigned:drive:android
$ npm run publishbeta:drive:android
```

### iOS

Open XCode and sign in to your Apple account. This account should be part of the Cozy team with the proper access rights so you can download the Cozy Cloud signing certificates.
Once you have the certificates, change the projects signing process to use these certificates and run:

```
$ npm run publish:drive:ios
```

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
