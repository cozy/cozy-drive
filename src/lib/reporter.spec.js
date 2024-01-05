import { normalizeData } from 'lib/reporter'

describe('Normalization function', () => {
  it('should normalize the culprit', () => {
    const data = { culprit: 'file://app.js' }
    expect(normalizeData(data)).toMatchSnapshot()
  })

  it('should normalize stacktraces', () => {
    const stacktrace = {
      frames: [
        { filename: 'file://app.js', random: 5 },
        { filename: 'file:///android_asset/www/app.js' },
        {
          filename:
            'file:///var/containers/Bundle/Application/1234-5678-ABCD/Cozy%20Drive.app/www/app.js'
        },
        { filename: '[native code]' }
      ]
    }
    const data = {
      exception: {
        values: [{ stacktrace }]
      }
    }

    expect(normalizeData(data)).toMatchSnapshot()
  })
})
