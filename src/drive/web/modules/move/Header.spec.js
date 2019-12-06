import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'

const onCloseSpy = jest.fn()
describe('Header', () => {
  //({ entries, onClose, title, subTitle }, { t })
  const setupComponent = ({ entries = [], onClose, title, subTitle }) => {
    const props = {
      entries,
      onClose,
      title,
      subTitle
    }
    return shallow(<Header {...props} />, {
      context: {
        t: jest.fn(x => x)
      }
    })
  }
  it('should fallback to Move title if no title is given', () => {
    const component = setupComponent({ onClose: onCloseSpy })
    expect(component).toMatchSnapshot()
  })
  it('should display title if title is given and no file', () => {
    const component = setupComponent({
      onClose: onCloseSpy,
      title: 'My Title'
    })
    expect(component).toMatchSnapshot()
  })
  it('should display the right title if only one file', () => {
    const component = setupComponent({
      onClose: onCloseSpy,
      title: 'My Title',
      entries: [
        {
          name: 'FileName.txt'
        }
      ]
    })
    expect(component).toMatchSnapshot()
  })
  it('should display the right title if more than one files', () => {
    const component = setupComponent({
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
    expect(component).toMatchSnapshot()
  })
})
