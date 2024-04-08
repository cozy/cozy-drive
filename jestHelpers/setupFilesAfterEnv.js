import '@testing-library/jest-dom'

import ConsoleUsageReporter from './ConsoleUsageReporter'

ConsoleUsageReporter.makeTestsFailWhenConsoleUsed()

process.on('unhandledRejection', error => console.error(error))
