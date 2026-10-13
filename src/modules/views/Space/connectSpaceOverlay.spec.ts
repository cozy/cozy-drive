import { computeOverlayRegion, mirrorStyles } from './connectSpaceOverlay'

describe('computeOverlayRegion', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('shows nothing while nothing is drawn', () => {
    expect(computeOverlayRegion(document)).toEqual([])
  })

  it('shows everything while a cozy-ui dialog is open', () => {
    document.body.innerHTML =
      '<div role="presentation" class="MuiDialog-root-12"></div>'

    expect(computeOverlayRegion(document)).toBe('full')
  })

  it('shows nothing once the dialog is hidden', () => {
    document.body.innerHTML =
      '<div role="presentation" class="MuiDialog-root-12" style="visibility: hidden"></div>'

    expect(computeOverlayRegion(document)).toEqual([])
  })
})

describe('mirrorStyles', () => {
  it('copies a style filled while a menu opens without waiting a frame', () => {
    const frame = document.createElement('iframe')
    document.body.appendChild(frame)
    const overlay = frame.contentDocument as Document
    mirrorStyles(document, overlay)
    const style = document.createElement('style')
    document.head.appendChild(style)

    style.textContent = '.menu-paper { position: absolute; }'

    const mirror = overlay.querySelector<HTMLStyleElement>('style[data-mirror]')
    const rules = Array.from(
      mirror?.sheet?.cssRules ?? [],
      rule => rule.cssText
    )
    expect(rules).toContainEqual(expect.stringContaining('.menu-paper'))
    style.remove()
    frame.remove()
  })
})
