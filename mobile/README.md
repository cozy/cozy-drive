# Mobile version


## :boat: Compile yourself


### :wrench: Requirements

- Node v6
- Android SDK 25.0.0 to deploy on android (download here: https://dl.google.com/android/repository/tools_r25.2.3-macosx.zip )
- Xcode 8.1 to deploy on ios
- cordova cli `npm install cordova -g`


### :package: Install and run in dev mode

```sh
$ git clone https://github.com/cozy/cozy-drive.git
$ cd cozy-drive
$ yarn install
```

mobile specific:

```sh
$ yarn build:mobile
$ cd mobile
$ cordova prepare
```

or if you develop :loop::

```sh
$ yarn watch:mobile
```


### :helicopter: Deploy

After that, you can deploy with one of these commands:

On android:

```sh
$ cd mobile
$ cordova run android
```

On iOS:

```sh
$ cd mobile
$ cordova run ios
```


## :lock: Create Release

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
