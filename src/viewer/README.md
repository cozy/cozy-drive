## Viewer Component

### TODO

These components should be standalone, but they currently have dependencies on a Cordova plugin and some Cordova helper functions. To remedy that, the plan is to:

- [ ] Provide only a set of basic, truly standalone viewers here
- [ ] Add the ability to configure the module to use specific Viewers under certain conditions
- [ ] Provide the `NativePdfViewer` through these options, as a replacement for the default PDF viewer in native apps
- [ ] Reduce the `NoViewer` to a more simple version of itself
- [ ] Provide an extended `NoViewer` that can open files in native apps
