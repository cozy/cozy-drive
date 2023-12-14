const { execSync } = require('child_process')
const nodeVersion = process.versions.node.split('.')[0]

if (parseInt(nodeVersion, 10) >= 17) {
  process.env.NODE_OPTIONS = '--openssl-legacy-provider'
}

const script = process.argv[2]
const additionalArgs = process.argv.slice(3).join(' ')

try {
  execSync(`${script} ${additionalArgs}`, { stdio: 'inherit' })
} catch (error) {
  console.error(`Error executing ${script}:`, error)
  process.exit(1)
}
