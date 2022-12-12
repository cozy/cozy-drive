import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Breadcrumb from './Breadcrumb'
import { dummyBreadcrumbPath } from 'test/dummies/dummyBreadcrumbPath'

describe('Breadcrumbs', () => {
  const path = dummyBreadcrumbPath()

  describe('template', () => {
    it('should match snapshot', () => {
      // When
      const { container } = render(<Breadcrumb path={path} />)

      // Then
      expect(container).toMatchSnapshot()
    })

    it('should be empty while path is undefined', () => {
      // When
      const { container } = render(<Breadcrumb />)

      // Then
      expect(container).toBeEmptyDOMElement()
    })

    it('should add inlined style while inlined prop true', () => {
      // When
      const { container } = render(<Breadcrumb path={path} inlined />)

      // Then
      expect(container.querySelector('.inlined')).not.toBeEmptyDOMElement()
    })

    it('should add inlined style while inlined prop true', () => {
      // Given
      const target = __TARGET__ // eslint-disable-line no-undef
      __TARGET__ = 'mobile' // eslint-disable-line no-undef

      // When
      const { container } = render(<Breadcrumb path={path} />)

      // Then
      expect(container.querySelector('.mobile')).not.toBeEmptyDOMElement()

      // After
      __TARGET__ = target // eslint-disable-line no-undef
    })
  })

  describe('events', () => {
    it('should fire on breadcrumb click when link is clicked', () => {
      // Given
      const onBreadcrumbClick = jest.fn()
      const { container } = render(
        <Breadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      )

      // When
      fireEvent.click(container.querySelector('.fil-path-link'))

      // Then
      expect(onBreadcrumbClick).toHaveBeenCalledWith({ name: 'Drive' })
    })

    it('should toggle deploy on click on current', () => {
      // Given
      document.addEventListener = jest.fn()

      // Given
      const { container } = render(<Breadcrumb path={path} />)

      // When
      fireEvent.click(container.querySelector('.fil-path-current'))

      // Then
      expect(container.querySelector('.deployed')).toBeInTheDocument()
      expect(document.addEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function)
      )
    })

    it('should close menu', () => {
      // Given
      document.removeEventListener = jest.fn()
      const { container } = render(<Breadcrumb path={path} />)
      fireEvent.click(container.querySelector('.fil-path-current'))

      expect(container.querySelector('.deployed')).toBeInTheDocument()

      // When
      fireEvent.click(container.querySelector('.fil-path-current'))

      // Then
      expect(container.querySelector('.deployed')).not.toBeInTheDocument()
    })
  })
})
