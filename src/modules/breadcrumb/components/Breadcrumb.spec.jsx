import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Breadcrumb from './Breadcrumb'
import { TestI18n } from 'test/components/AppLike'
import { dummyBreadcrumbPathWithRootLarge } from 'test/dummies/dummyBreadcrumbPath'

describe('Breadcrumbs', () => {
  const dummyPath = dummyBreadcrumbPathWithRootLarge()

  const setup = ({ path, inlined, onBreadcrumbClick } = {}) => {
    return render(
      <TestI18n>
        <Breadcrumb
          path={path}
          inlined={inlined}
          onBreadcrumbClick={onBreadcrumbClick}
        />
      </TestI18n>
    )
  }

  describe('template', () => {
    it('should match snapshot', () => {
      // When
      const { container } = setup({ path: dummyPath })

      // Then
      expect(container).toMatchSnapshot()
    })

    it('should be empty while path is undefined', () => {
      // When
      const { container } = setup()

      // Then
      expect(container).toBeEmptyDOMElement()
    })

    it('should add inlined style while inlined prop true', () => {
      // When
      const { container } = setup({ path: dummyPath, inlined: true })

      // Then
      expect(container.querySelector('.inlined')).not.toBeEmptyDOMElement()
    })
  })

  describe('events', () => {
    it('should fire on breadcrumb click when link is clicked', () => {
      // Given
      const onBreadcrumbClick = jest.fn()
      const { container } = setup({ path: dummyPath, onBreadcrumbClick })

      // When
      fireEvent.click(container.querySelector('.fil-path-link'))

      // Then
      expect(onBreadcrumbClick).toHaveBeenCalledWith({
        id: 'io.cozy.files.root-dir',
        name: 'Drive'
      })
    })

    it('should toggle deploy on click on current', () => {
      // Given
      document.addEventListener = jest.fn()

      // Given
      const { container } = setup({ path: dummyPath })

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
      const { container } = setup({ path: dummyPath })
      fireEvent.click(container.querySelector('.fil-path-current'))

      expect(container.querySelector('.deployed')).toBeInTheDocument()

      // When
      fireEvent.click(container.querySelector('.fil-path-current'))

      // Then
      expect(container.querySelector('.deployed')).not.toBeInTheDocument()
    })
  })
})
