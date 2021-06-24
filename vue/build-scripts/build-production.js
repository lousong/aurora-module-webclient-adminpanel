const fse = require('fs-extra')

require('./prepare-langs')
require('./prepare-modules')

console.log('Start building the app...')
const execSync = require('child_process').execSync
execSync('quasar build')

const srcDir = './dist/spa'
if (fse.existsSync(srcDir)) {
  console.log('The app is built successfully')

  const destDir = '../../../adminpanel/'
  if (fse.existsSync(destDir)) {
    console.log('Please delete the adminpanel directory manually before running this script')
    // TODO: unlink fails with error "EPERM: operation not permitted, unlink"
    // For now, the adminpanel directory must be manually deleted before running this script.
    // fse.unlinkSync(destDir)
  } else {
    console.log('Start moving app files to the adminpanel directory...')
    fse.moveSync(srcDir, destDir)
    console.log('The app is now in the adminpanel directory')

    console.log('Start to create index.php...')
    const indexPhpContent = `<?php
if (isset($_GET['/Api']) || isset($_GET['/Api/']))
{
\tinclude_once '../index.php';
}
else
{
\tinclude_once './index.html';
}
`
    fse.writeFileSync(destDir + 'index.php', indexPhpContent)
    console.log('Everything is ready now')
  }
} else {
  console.log('An error occurred while building the app')
}
