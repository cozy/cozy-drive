# 1.41.0

## ✨ Features

* When displaying cozy-home from Cozy's native application, the Support Us is not displayed

## 🐛 Bug Fixes

 * Compute sizes in MB instead of MiB in dacc service.
 * Query files based on their uploaded date in dacc service.
 * Upload drop zone can correctly upload file with name containing ampersand "&" and hash "#"
 * Do not query encryption files when flag is not set

## 🔧 Tech

* Update several dependencies packages
* Publish in our internal communication tool, when new versions of the applications are released
* Update documentation about standalone mode
* Add bundlemon size limit

# 1.40.0

## 🐛 Bug Fixes

* Escape public name in public cozy-to-cozy sharing view

## 🔧 Tech

* Update several dependencies packages
* Remove cozy-jobs-cli useless devDependencies packages
* Remove piwik-react-router useless dependencies packages
* Add date attribute to dacc flag
* Add generic build command
* Move [dependabot](https://github.com/dependabot) config file to correct location
* Fix auto-merge job what disallowed used merge commits
* Remove Drive Android job


# 1.39.0

## ✨ Features

* Use MUI Breadcrumb with fully fetched path
* Add feature flag on Breadcrumb on public view
* Allow all users to see progress on upload file
* DACC service to send anonymized measures about the file sizes grouped by app/konnector
* Implement cozy-bar AA navigation
* Log sentry exception on click on add menu when offline
* Upgrade cozy-client to allow all users to see progress on upload file
* Upgrade cozy-ui to benefit of new version of material-ui component

## 🐛 Bug Fixes

* Upgrade cozy-ui to make upload progress bar size fixed
* Upload: return average remaining time each 3 seconds

## 🔧 Tech

* Format style files of the full repository to respect the Cozy Stylint config
* Update several dependencies packages
* Remove node-uuid unused package
* Configure the bot [dependabot](https://github.com/dependabot) to commit according to our convention
* Use only one syntax of data-testid

# 1.38.0

## ✨ Features

* Filename is displayed in title when hovering the line.
* Add multiple import at once for Android
* Remove Pouch adapter migration

## 🐛 Bug Fixes

* Do not update files in parallel in the qualification migration service, as it might fail in nsjail for too many files
* Fix MoveModal breadcrumb
* Display reasons of incorrect file name (illegal characters, forbidden name)
* Prevent errors during upload of file inside Dropzone
* Handle better icon inside the searchbar
* Upgrade cozy-client in order to fix albums page from photos

## 🔧 Tech

* Use `<SharingBannerPlugin />` and `useSharingInfos()` from `cozy-sharing` instead of internal components
* Fixed an error in Search result when the result contained at least one Cozy Note
* Update cordova to 8.1.2 and cordova-android to 9.1.0
* Upgrade cozy-client, cozy-scanner caniuse-lite and fix tests
* Upgrade cozy-sharing to fix typo in French
* Add locales in gitignore
* Explicit full path when importing cozy-ui component inside doc

# 1.37.0

## 🐛 Bug Fixes

* Fixed an error on mobile that was preventing users to long tap in order to trigger multiple files selection
* Fixed an error in directory tree names appearing under filenames where sometimes, the path appeared scrambled
* Fixed an error where creating a directory sent two save actions instead of one
* Added a missing loading status on delete confirm modal button
* Fixed issues related to recent view not going where it should when navigating back and forth in directory paths

## 🔧 Tech

* Add CodeQL in order to scan the code 🚫
* Add rel noopener on target blank link
