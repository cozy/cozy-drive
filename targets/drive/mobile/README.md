# Drive Mobile version


## :boat: Compile yourself


### :wrench: Requirements

- Node v6 (on macOS: `brew install node@6 && brew link node@6`)
- ImageMagick (on macOS: `brew install imagemagick`)
- Android SDK >= 25.0.0 to deploy on android
- Xcode 8.1 >= to deploy on ios
- Cordova v6 CLI (`npm install cordova@6 -g`)


### :package: Install and run in dev mode

```sh
$ git clone https://github.com/cozy/cozy-drive.git
$ cd cozy-drive
$ yarn install
```

mobile specific:

```sh
$ yarn mobile:drive:icon
$ yarn build:drive:mobile
$ cd targets/drive/mobile
$ cordova prepare
```

or if you develop :loop::

```sh
$ yarn watch:drive:mobile
```


### :helicopter: Deploy

After that, you can deploy with one of these commands:

On Android:

```sh
$ cd targets/drive/mobile
$ cordova run android
```

On iOS: open the mobile/platforms/ios/Cozy Drive.xcworkspace in Xcode, update the Swift syntax if needed, set your signing certificate on the target (if you're testing on a device), then:

```sh
$ cd targets/drive/mobile
$ cordova run ios
```

### Standalone mode
- Open your browser with web-security CORS disabled
- launch `$ yarn watch:mobile:standalone`
- Go to localhost:8084 in your browser and open the console
- Follow the onboarding and after giving your cozy URL, click on the link logged in the console
- Log yourself, accept permissions and copy the url you've been redirected to.
- Return to your previous tab and paste the url in the prompt (be quick, or take your time, whatever, because the prompt may be blocked when it pops if you're still on the permissions tab)
- Profit!

## :lock: Create Release

## TODO: update this part

### Android

Create this folders:

```
$ mkdir mobile/keys
$ mkdir mobile/keys/android
$ mkdir mobile/build
$ mkdir mobile/build/android
```

You must have this files:

- keys/android/cozy-drive-release-key.jks (and the password)
- keys/android/key.json

To generate a signed APK on `mobile/build/android/` and publish on Google Play:

```
$ npm run android:publish
```


## :rainbow: Icons & Splashscreen

You can generate all icons with [splashicon-generator](https://github.com/eberlitz/splashicon-generator).

```sh
$ yarn mobile:icon
```

### Icon

Should be a 1024x1024px.

- `mobile/res/model/icon.png`. On iOS add 5% margin
- `mobile/res/model/android/icon.png`. Override the default icon for the 'android' platform. So you can use an icon with alpha, as apple doens't allow.

### Splashscreen

Your splash must be 2732x2732px as it now is the largest resolution (used by iPad Pro 12.9"), and the artwork should fit a center square (1200x1200px). This Photoshop splash screen template provides the recommended size and guidelines of the artwork’s safe zone.

- `mobile/res/model/splash.png`
