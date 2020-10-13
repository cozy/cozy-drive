import React from 'react'
import { render } from '@testing-library/react'
import Header from './Header'
import { TestI18n } from 'test/components/AppLike'
import en from 'drive/locales/en.json'
import Polyglot from 'node-polyglot'
const onCloseSpy = jest.fn()
describe('Header', () => {
  const setupComponent = ({ entries = [], onClose, title, subTitle }) => {
    const props = {
      entries,
      onClose,
      title,
      subTitle
    }
    const polyglot = new Polyglot()
    polyglot.extend(en)
    const t = polyglot.t.bind(polyglot)
    return {
      ...render(
        <TestI18n>
          <Header {...props} />
        </TestI18n>
      ),
      t
    }
  }
  it('should fallback to Move title if no title is given', () => {
    const { getByText, t } = setupComponent({ onClose: onCloseSpy })
    expect(getByText(t('Move.title', { smart_count: 0 })))
  })
  it('should display title if title is given and no file', () => {
    const { getByText } = setupComponent({
      onClose: onCloseSpy,
      title: 'My Title'
    })
    expect(getByText('My Title'))
  })
  it('should display the right title if only one file', () => {
    const { getByText } = setupComponent({
      onClose: onCloseSpy,
      title: 'My Title',
      entries: [
        {
          name: 'FileName.txt'
        }
      ]
    })
    expect(getByText('FileName.txt'))
    //expect(component).toMatchSnapshot()
  })
  it('should display the right title if more than one files', () => {
    const { getByText } = setupComponent({
      onClose: onCloseSpy,
      title: 'My Title',
      entries: [
        {
          name: 'FileName.txt'
        },
        {
          name: 'FileName2.txt'
        }
      ]
    })
    expect(getByText('My Title'))
  })
})
