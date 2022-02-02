# 1.39.0

## 🔧 Tech

* Stylint with Cozy config each .styl files in src

## ✨ Features

* DACC service to send anonymized measures about the file sizes grouped by app/konnector

# 1.38.0

## ✨ Features

* Add multiple import at once for Android
* Remove Pouch adapter migration

## 🐛 Bug Fixes

* Do not update files in parallel in the qualification migration service, as it might fail in nsjail for too many files

## 🔧 Tech

* Use `<SharingBannerPlugin />` and `useSharingInfos()` from `cozy-sharing` instead of internal components
* Fixed an error in Search result when the result contained at least one Cozy Note
* Update cordova to 8.1.2 and cordova-android to 9.1.0

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
