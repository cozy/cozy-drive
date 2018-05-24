const fs = require('fs')
const path = require('path')
const rootdir = process.env.PWD
const installWithPluginId = 'com.web-mystery.cordova.openwith-ios'

module.exports = function (context) {
  if (context.opts.cordova.plugins.indexOf(installWithPluginId) < 0) return

  const platformIOSPath = '/platforms/ios/'

  const replacements = [
    {
      file: 'ShareExtension/ShareExtension-Info.plist',
      pattern: /<key>NSExtensionActivationRule<\/key>[^]*?<dict>[^]*?<\/dict>/m,
      substitute:
       `<key>NSExtensionActivationRule</key>
        <dict>
          <key>NSExtensionActivationSupportsImageWithMaxCount</key>
          <integer>10</integer>
          <key>NSExtensionActivationSupportsFileWithMaxCount</key>
          <integer>10</integer>
        </dict>`
    },
    {
      file: 'Cozy Drive/Entitlements-Debug.plist',
      pattern: /<dict>[^]*?<\/dict>/m,
      substitute: `<dict><key>com.apple.security.application-groups</key><array><string>group.io.cozy.drive.mobile.shareextension</string></array></dict>`
    },
    {
      file: 'Cozy Drive/Entitlements-Release.plist',
      pattern: /<dict>[^]*?<\/dict>/m,
      substitute: `<dict><key>com.apple.security.application-groups</key><array><string>group.io.cozy.drive.mobile.shareextension</string></array></dict>`
    },
    {
      file: 'Cozy Drive.xcodeproj/project.pbxproj',
      pattern: /com.apple.ApplicationGroups.iOS = {[^]*?enabled = 0;/m,
      substitute: `com.apple.ApplicationGroups.iOS = {\nenabled = 1;`
    }
  ]

  replacements.forEach(replacement => {
    const filePath = path.join(rootdir, platformIOSPath, replacement.file)

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const replaced = content.replace(replacement.pattern, replacement.substitute)
      fs.writeFileSync(filePath, replaced)
      console.log('updated ' + filePath)
    }
    else {
      console.warn(`Could not access file ${filePath}`);
    }
  })
}
