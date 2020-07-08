import { generateFile } from 'test/generate'

export const generateFileFixtures = ({
  nbFiles = 5,
  path = '/test',
  dir_id = 'io.cozy.files.root-dir',
  updated_at = '2020-05-14T10:33:31.365224+02:00',
  type = 'file',
  prefix
}) => {
  const filesFixture = Array(nbFiles)
    .fill(null)
    .map((x, i) => generateFile({ i, type, path, dir_id, updated_at, prefix }))

  return filesFixture
}

export const getByTextWithMarkup = (getByText, text) => {
  getByText((content, node) => {
    const hasText = node => node.textContent === text
    const childrenDontHaveText = Array.from(node.children).every(
      child => !hasText(child)
    )
    return hasText(node) && childrenDontHaveText
  })
}
