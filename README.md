[![Travis build status shield](https://img.shields.io/travis/cozy/cozy-files-v3.svg?branch=master)](https://travis-ci.org/cozy/cozy-files-v3)
[![NPM release version shield](https://img.shields.io/npm/v/cozy-files-v3.svg)](https://www.npmjs.com/package/cozy-files-v3)
[![Github Release version shield](https://img.shields.io/github/tag/cozy/cozy-files-v3.svg)](https://github.com/cozy/cozy-files-v3/releases)
[![NPM Licence shield](https://img.shields.io/npm/l/cozy-files-v3.svg)](https://github.com/cozy/cozy-files-v3/blob/master/LICENSE)


[Cozy] Files
=======================


What's Cozy?
------------

![Cozy Logo](https://cdn.rawgit.com/cozy/cozy-guidelines/master/templates/cozy_logo_small.svg)

[Cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.


What's Files?
------------------

Cozy Files makes your file management easy. Main features are:

- File tree
- Files and folders upload.
- Files and folders sharing (via URLs)
- Files and folders search


Hack
----

_:pushpin: Note:_ we recommend to use [Yarn] instead of NPM for package management. Don't hesitate to [install][yarn-install] and use it for your Cozy projects, it's now our main node packages tool for Cozy official apps.

### Install and run in dev mode

Hacking the Files app requires you to [setup a dev environment][setup].

You can then clone the app repository and install dependencies:

```sh
$ git clone https://github.com/cozy/cozy-files-v3.git
$ cd cozy-files-v3
$ yarn install
```

:pushpin: If you use a node environment wrapper like [nvm] or [ndenv], don't forget to set your local node version before doing a `yarn install`.

:warning: During its early ages, _cozy-files-v3_ uses an unpublishing version of [cozy-ui], take a look at the [note about cozy-ui](#note-about-cozy-ui) below to install and configure it.

Cozy's apps use a standard set of _npm scripts_ to run common tasks, like watch, lint, test, build…


#### Note about Cozy-ui

[Cozy-ui] is our frontend stack library that provides common styles and components accross the whole Cozy's apps. You can use it for you own application to follow the official Cozy's guidelines and styles. If you need to develop / hack cozy-ui, it's sometimes more useful to develop on it through another app. You can do it by cloning cozy-ui locally and link it to yarn local index:

```sh
git clone https://github.com/cozy/cozy-ui.git -b v3
cd cozy-ui
yarn install
yarn link
```

then go back to your app project and replace the distributed cozy-ui module with the linked one:

```sh
cd cozy-files-v3
yarn link cozy-ui
```

You can now run the watch task and your project will hot-reload each times a cozy-ui source file is touched.


### Run it inside the VM

You can easily view your current running app, you can use the [cozy-stack docker image][cozy-stack-docker]:

```sh
# in a terminal, run your app in watch mode
$ cd cozy-files-v3
$ yarn run watch
```

```sh
# in another terminal, run the docker container
$ docker run --rm -it -p 8080:8080 -v "$(pwd)/build":/data/cozy-app cozy/cozy-app-dev
```

your app is available at http://localhost:8080.


### Tests

Tests are run by [mocha] under the hood, and written using [chai] and [sinon]. You can easily run the tests suite with:

```sh
$ cd cozy-files-v3
$ yarn test
```

:pushpin: Don't forget to update / create new tests when you contribute to code to keep the app the consistent.


### Resources

All documentation is located in the `/docs` app directory. It provides an exhaustive documentation about workflows (installation, development, pull-requests…), architecture, code consistency, data structures, dependencies, and more.

Feel free to read it and fix / update it if needed, all comments and feedback to improve it are welcome!


### Open a Pull-Request

If you want to work on Files and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about how to properly open pull-requests.


Community
---------

### Localization

Localization and translations are handled by [Transifex][tx], which is used by all Cozy's apps.

As a _translator_, you can login to [Transifex][tx-signin] (using your Github account) and claim an access to the [app repository][tx-app]. Locales are pulled when app is build before publishing.

As a _developer_, you must [configure the transifex client][tx-client], and claim an access as _maintainer_ is the [app repository][tx-app]. Then please **only update** the source locale file (usually `en.json` in client and/or server parts), and push it to Transifex repository using the `tx push -s` command.


### Maintainer

The lead maintainer for Cozy Files is @GoOz, send him/her a :beers: to say hello!


### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]


License
-------

Cozy Files is developed by Cozy Cloud and distributed under the [AGPL v3 license][agpl-3.0].



[cozy]: https://cozy.io "Cozy Cloud"
[setup]: https://dev.cozy.io/#set-up-the-development-environment "Cozy dev docs: Set up the Development Environment"
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/en/docs/install
[cozy-ui]: https://github.com/cozy/cozy-ui/
[cozy-stack-docker]: https://github.com/cozy/cozy-stack/blob/master/docs/client-app-dev.md#with-docker
[doctypes]: https://dev.cozy.io/#main-document-types
[bill-doctype]: https://github.com/cozy-labs/konnectors/blob/master/server/models/bill.coffee
[konnector-doctype]: https://github.com/cozy-labs/konnectors/blob/master/server/models/konnector.coffee
[konnectors]: https://github.com/cozy-labs/konnectors
[agpl-3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[contribute]: CONTRIBUTING.md
[tx]: https://www.transifex.com/cozy/
[tx-signin]: https://www.transifex.com/signin/
[tx-app]: https://www.transifex.com/cozy/cozy-files-v3/dashboard/
[tx-client]: http://docs.transifex.com/client/
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/mycozycloud
[nvm]: https://github.com/creationix/nvm
[ndenv]: https://github.com/riywo/ndenv
[cozy-dev]: https://github.com/cozy/cozy-dev/
[cozy-ui]: https://github.com/cozy/cozy-ui.git
[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[sinon]: http://sinonjs.org/
[checkbox]: https://help.github.com/articles/basic-writing-and-formatting-syntax/#task-lists
