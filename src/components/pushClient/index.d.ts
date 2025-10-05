export declare const DESKTOP_SOFTWARE_ID: string
export declare const DESKTOP_BANNER: string
export declare const DESKTOP_SMALL_BANNER: string
export declare const NOVIEWER_DESKTOP_CTA: string

export declare function isLinux(): boolean
export declare function isMacOS(): boolean
export declare function isAndroid(): boolean
export declare function isIOS(): boolean
export declare function isClientAlreadyInstalled(
  client: unknown
): Promise<boolean>
export declare function getDesktopAppDownloadLink(options: {
  t: (key: string) => string
}): string
export declare function getMobileAppDownloadLink(options: {
  t: (key: string) => string
}): string
