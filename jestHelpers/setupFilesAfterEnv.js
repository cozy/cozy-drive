import ConsoleUsageReporter from './ConsoleUsageReporter'

ConsoleUsageReporter.makeTestsFailWhenConsoleUsed()

process.on('unhandledRejection', error => console.error(error))
