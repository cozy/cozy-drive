import { ClientFunction, t } from 'testcafe'

export const TESTCAFE_PHOTOS_URL = process.env.TESTCAFE_PHOTOS_URL
export const TESTCAFE_DRIVE_URL = process.env.TESTCAFE_DRIVE_URL
export const TESTCAFE_USER_PASSWORD = process.env.TESTCAFE_USER_PASSWORD

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)

export function wait(timeout) {
  //@param {number} timeout : amount of time in milliseconds during which a selector property must be stable
  return {
    until: selector => {
      return {
        // exists property of selector
        exists: {
          // wait until exists property of selector is stable
          isStable: async () => {
            const interval = 100
            const elapsedTimeMaxValue = timeout * 3
            let stabilityElapsedTime = 0
            let previousValue = ''
            let elapsedTime = 0
            while (true) {
              await t.wait(interval)
              const currentValue = (await selector.exists).toString()
              //console.log(`Selector exists property evaluates to '${currentValue}'`)
              if (currentValue !== previousValue) {
                stabilityElapsedTime = 0
              }
              if (currentValue === previousValue) {
                stabilityElapsedTime += interval
              }
              previousValue = currentValue
              elapsedTime += interval
              if (stabilityElapsedTime > timeout) {
                //  console.log(`Now it is safe to check if selector exists`)
                return
              }
              if (elapsedTime > elapsedTimeMaxValue) {
                console.log(`Selector is unstable`)
                return
              }
            }
          }
        }
      }
    }
  }
}
