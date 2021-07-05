const fse = require('fs-extra')
const fs = require('fs-extra')

const removeDir = function(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + '/' + filename).isDirectory()) {
          removeDir(path + '/' + filename)
        } else {
          fs.unlinkSync(path + '/' + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
  } else {
    console.log('Directory path not found.')
  }
}

require('./prepare-langs')
require('./prepare-modules')
require('./prepare-stores')

console.log('Start building the app...')
const execSync = require('child_process').execSync
execSync('quasar build')

const srcDir = './dist/spa'
if (fse.existsSync(srcDir)) {
  console.log('The app is built successfully')

  const destDir = '../../../adminpanel/'
  if (fse.existsSync(destDir)) {
    removeDir(destDir)
  }

  console.log('Start moving app files to the adminpanel directory...')
  fse.moveSync(srcDir, destDir)
  fse.renameSync(destDir + 'index.html', destDir + 'main.html')
  console.log('The app is now in the adminpanel directory')

  console.log('Start to create index.php...')
  const indexPhpContent = `<?php
if (isset($_GET['/Api']) || isset($_GET['/Api/']))
{
\tinclude_once '../index.php';
}
else
{
\tinclude_once './main.html';
}
`
  fse.writeFileSync(destDir + 'index.php', indexPhpContent)
  console.log('Everything is ready now')
} else {
  console.log('An error occurred while building the app')
}
