require('./prepare-langs')
require('./prepare-modules')

console.log('Start building the app')
const exec = require('child_process').exec
exec('quasar build')
console.log('The app is built successfully')

const fse = require('fs-extra')
const srcDir = './dist/spa'
const destDir = '../../../adminpanel/'
if (fse.existsSync(destDir)) {
  console.log('Please delete the adminpanel directory manually before running this script')
  // TODO: unlink fails with error "EPERM: operation not permitted, unlink"
  // For now, the adminpanel directory must be manually deleted before running this script.
  // fse.unlinkSync(destDir)
} else {
  console.log('Start moving app files to the adminpanel directory')
  fse.moveSync(srcDir, destDir)
  console.log('The app is now in the adminpanel directory')
}
