'use strict'
const fs = require('fs')
const ini = require('ini')

function prepareLangs () {
  const sModulesPath = './src/../../'
  prepareOneLang(sModulesPath, 'English.ini', 'en-us')
  prepareOneLang(sModulesPath, 'Russian.ini', 'ru')
}

function prepareOneLang (sModulesPath, sIniFile, sLangFolder) {
  const oLangsJson = {}
  fs.readdirSync(sModulesPath).forEach(sModuleName => {
    const sI18nPath = sModulesPath + sModuleName + '/i18n/' + sIniFile
    const sEnglishI18nPath = sModulesPath + sModuleName + '/i18n/English.ini'
    if (fs.existsSync(sI18nPath)) {
      const content = fs.readFileSync(sI18nPath, 'utf8')
      oLangsJson[sModuleName.toUpperCase()] = ini.parse(content.toString())
    } else if (fs.existsSync(sEnglishI18nPath)) {
      const content = fs.readFileSync(sEnglishI18nPath, 'utf8')
      oLangsJson[sModuleName.toUpperCase()] = ini.parse(content.toString())
    }
  });
  const dir = './src/i18n/' + sLangFolder + '/'
  if (fs.existsSync(dir)) {
    fs.writeFileSync(dir + 'index.json', JSON.stringify(oLangsJson, null, 2))
  }
}

prepareLangs()
