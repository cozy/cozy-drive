import { PdfJsViewer, MIN_SCALE, MAX_SCALE } from './PdfJsViewer'
import React from 'react'
import { shallow } from 'enzyme'

describe('PDFViewer', () => {
  let component
  beforeEach(() => {
    component = shallow(<PdfJsViewer url={'test'} />)
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
