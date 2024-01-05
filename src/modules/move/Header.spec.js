import React from 'react'
import { render } from '@testing-library/react'
import CozyClient from 'cozy-client'

import AppLike from 'test/components/AppLike'
import Header from './Header'

describe('Header', () => {
  const setupComponent = ({ entries = [], title, subTitle }) => {
    const props = {
      entries,

      title,
      subTitle
    }
    const client = new CozyClient({})

    return render(
      <AppLike client={client}>
        <Header {...props} />
      </AppLike>
    )
  }
  it('should fallback to Move title if no title is given', () => {
    const { getByText } = setupComponent({
      entries: [{ file: 1 }, { file: 2 }]
    })
    expect(getByText('2 elements'))
  })
  it('should display title if title is given and no file', () => {
    const { getByText } = setupComponent({
      title: 'My Title'
    })
    expect(getByText('My Title'))
  })
  it('should display the right title if only one io.cozy.files', () => {
    const { getByText } = setupComponent({
      title: 'My Title',
      entries: [
        {
          name: 'FileName.txt',
          class: 'file'
        }
      ]
    })
    expect(getByText('FileName.txt'))
  })

  it('should display the right title if it comes from the outside', () => {
    const { getByText } = setupComponent({
      title: 'My Title',
      entries: [
        {
          name: 'FileName.txt'
        }
      ]
    })
    expect(getByText('FileName.txt'))
  })
  it('should display the right title if more than one files', () => {
    const { getByText } = setupComponent({
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
