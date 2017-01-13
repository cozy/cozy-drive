# Mobile version


## :boat: Compile yourself


### :wrench: Requirements

- Node v6
- Android SDK 25.0.0 to deploy on android
- Xcode 8.1 to deploy on ios
- cordova cli `npm install cordova -g`


### :package: Install and run in dev mode

```sh
$ git clone https://github.com/cozy/cozy-files-v3.git
$ cd cozy-files-v3
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


## :rainbow: Icons

You can generate all icons with [splashicon-generator](https://github.com/eberlitz/splashicon-generator).

Icon: Should be a 1024x1024px with a 5% margin. `res/icon.png`

````sh
$ npm install -g splashicon-generator
$ cd mobile
$ splashicon-generator --imagespath="res"
```
