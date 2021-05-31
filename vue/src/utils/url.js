import _ from 'lodash'

export default {
  /**
   * Obtains application path from location object.
   *
   * @return {string}
   */
  getAppPath () {
    const appOrigin = window.location.origin || window.location.protocol + '//' + window.location.host

    return appOrigin + window.location.pathname
  },

  /**
   * Obtains parameters from browser get-string.
   * **getParams** - static variable which includes all get parameters.
   *
   * @param {string} paramName Name of parameter which is obtained from get-string
   *
   * @return {string|null}
   */
  getRequestParam (paramName) {
    if (this.getParams === undefined) {
      const params = (location.search !== '') ? (location.search.substr(1)).split('&') : []
      const getParams = []

      if (params.length > 0) {
        _.each(params, function (param) {
          const keyValues = param.split('=')
          getParams[keyValues[0]] = keyValues.length > 1 ? keyValues[1] : ''
        })
      }

      this.getParams = getParams
    }

    let result = null
    if (this.getParams[paramName] !== undefined) {
      result = this.getParams[paramName]
    }
    return result
  },
}
