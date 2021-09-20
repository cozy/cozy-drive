# 1.38.0
## 🔧 Tech
* Use `<SharingBannerPlugin />` and `useSharingInfos()` from `cozy-sharing` instead of internal components

# 1.37.0
## 🐛 Bug Fixes

* Fixed an error on mobile that was preventing users to long tap in order to trigger multiple files selection
* Fixed an error in directory tree names appearing under filenames where sometimes, the path appeared scrambled
* Fixed an error where creating a directory sent two save actions instead of one
* Added a missing loading status on delete confirm modal button
* Fixed issues related to recent view not going where it should when navigating back and forth in directory paths

## 🔧 Tech
* Add CodeQL in order to scan the code🚫
* Add rel noopener on target blank link
