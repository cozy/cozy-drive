import { PdfJsViewer, MIN_SCALE, MAX_SCALE, MAX_PAGES } from './PdfJsViewer'
import React from 'react'
import { shallow } from 'enzyme'

describe('PDFViewer', () => {
  let component
  const panGestureMock = jest.fn()
  const swipeGestureMock = jest.fn()
  const gesturesMock = {
    get: jest.fn(type => ({
      set: type === 'pan' ? panGestureMock : swipeGestureMock
    }))
  }
  beforeEach(() => {
    component = shallow(<PdfJsViewer url={'test'} gestures={gesturesMock} />)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('desture integration', () => {
    let instance
    beforeEach(() => {
      instance = component.instance()
    })

    it('should disable gestures when zooming in', () => {
      instance.scaleUp()
      expect(component.state('scale')).toBeGreaterThan(1)
      expect(panGestureMock).toHaveBeenCalledWith({ enable: false })
      expect(swipeGestureMock).toHaveBeenCalledWith({ enable: false })
      instance.scaleUp()
      expect(panGestureMock).toHaveBeenCalledTimes(1)
      expect(swipeGestureMock).toHaveBeenCalledTimes(1)
    })

    it('should leave gestures alone when zooming out', () => {
      instance.scaleDown()
      expect(component.state('scale')).toBeLessThan(1)
      expect(panGestureMock).not.toHaveBeenCalled()
      expect(swipeGestureMock).not.toHaveBeenCalled()
    })

    it('should re-enable gestures when zooming back out', () => {
      instance.scaleUp()
      expect(component.state('scale')).toBeGreaterThan(1)
      expect(panGestureMock).toHaveBeenCalledWith({ enable: false })
      expect(swipeGestureMock).toHaveBeenCalledWith({ enable: false })
      instance.scaleDown()
      expect(component.state('scale')).toBe(1)
      expect(panGestureMock).toHaveBeenCalledWith({ enable: true })
      expect(swipeGestureMock).toHaveBeenCalledWith({ enable: true })
    })
  })

  describe('with a valid PDF', () => {
    let instance
    beforeEach(() => {
      instance = component.instance()
      instance.onLoadSuccess({ numPages: 3 })
    })

    it('should start with default options', () => {
      expect(component.state('loaded')).toBe(true)
      expect(component.state('totalPages')).toBe(3)
      expect(component.state('currentPage')).toBe(1)
      expect(component.state('scale')).toBe(1)
    })

    it('should flip to the next page while possible', () => {
      instance.nextPage()
      expect(component.state('currentPage')).toBe(2)
      instance.nextPage()
      expect(component.state('currentPage')).toBe(3)
      instance.nextPage()
      expect(component.state('currentPage')).toBe(3)
    })

    it('should flip to the previous page while possible', () => {
      instance.nextPage()
      expect(component.state('currentPage')).toBe(2)
      instance.previousPage()
      expect(component.state('currentPage')).toBe(1)
      instance.previousPage()
      expect(component.state('currentPage')).toBe(1)
    })

    it('should scale up to a certain point', () => {
      const initialScale = component.state('scale')
      instance.scaleUp()
      expect(component.state('scale')).toBeGreaterThan(initialScale)

      for (let i = 0; i < 10; i++) instance.scaleUp()
      expect(component.state('scale')).toEqual(MAX_SCALE)
    })

    it('should scale down to a certain point', () => {
      const initialScale = component.state('scale')
      instance.scaleDown()
      expect(component.state('scale')).toBeLessThan(initialScale)

      for (let i = 0; i < 10; i++) instance.scaleDown()
      expect(component.state('scale')).toEqual(MIN_SCALE)
    })
  })

  describe('a PDF with few pages', () => {
    beforeEach(() => {
      component.instance().onLoadSuccess({ numPages: MAX_PAGES })
    })

    it('should render all the pages', () => {
      const pages = component.find('Page')
      expect(pages.length).toEqual(MAX_PAGES)
    })

    it('should not show pagination controls', () => {
      const pageUp = component.find({ icon: 'top' })
      const pageDown = component.find({ icon: 'bottom' })
      expect(pageUp.length).toEqual(0)
      expect(pageDown.length).toEqual(0)
    })
  })

  describe('a PDF with many pages', () => {
    beforeEach(() => {
      component.instance().onLoadSuccess({ numPages: MAX_PAGES + 1 })
    })

    it('should render only the current page', () => {
      const pages = component.find('Page')
      expect(pages.length).toEqual(1)
    })

    it('should show pagination controls', () => {
      const pageUp = component.find({ icon: 'top' })
      const pageDown = component.find({ icon: 'bottom' })
      expect(pageUp.length).toEqual(1)
      expect(pageDown.length).toEqual(1)
    })
  })

  describe('with a pdf that does not load', () => {
    it('should show a fallback', () => {
      component.instance().onLoadError('pdfviewer test error')
      expect(component.state('errored')).toBe(true)
      const wrapper = component.find('Wrapper')
      const noViewer = wrapper.dive().find('NoViewer')
      expect(noViewer.length).toBe(1)
    })
  })
})
