export declare function changeLocation(url: string): void

export declare function displayedFolderOrRootFolder(displayedFolder: unknow): {
  id: string
}

export declare function isEditableTarget(target: EventTarget | null): boolean

export declare function isEditableButNotCheckbox(
  target: EventTarget | null
): boolean

export declare function normalizeKey(
  event: KeyboardEvent,
  isApple: boolean
): string
