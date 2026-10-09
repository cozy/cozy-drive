import { computeOverlayRegion } from './connectSpaceOverlay'

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
