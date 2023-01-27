import ReactRouter from 'react-router-dom'
import useCurrentFileId from './useCurrentFileId'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}))

describe('useCurrentFileId', () => {
  it('should return file id if in params', () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ fileId: 'file-id' })

    const currentFileId = useCurrentFileId()

    expect(currentFileId).toBe('file-id')
  })

  it('should return null id if not in params', () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({})

    const currentFileId = useCurrentFileId()

    expect(currentFileId).toBe(null)
  })
})
