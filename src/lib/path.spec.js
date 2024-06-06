import { getParentPath } from './path'

it('getParentPath', () => {
  expect(getParentPath('/')).toBeUndefined()
  expect(getParentPath('/folder1')).toEqual('/')
  expect(getParentPath('/folder1/folder2/folder3')).toEqual('/folder1/folder2')
  expect(getParentPath('/folder1/folder2/file1.png')).toEqual(
    '/folder1/folder2'
  )
  expect(getParentPath('/folder1/folder2')).toEqual('/folder1')
})
