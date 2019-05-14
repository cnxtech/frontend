const {mapUrlToParams, getFiltersByPath} = require('./url-to-params-mapper')
const mapToUrl = require('./params-to-url-mapper')

class ParamsMapper {
  static mapUrlToParams(params) {
    return mapUrlToParams(params)
  }
  static mapParamsToUrl(params, filters) {
    return mapToUrl(params, filters)
  }
  static getFiltersByPath(rest) {
    return getFiltersByPath(rest)
  }
}

module.exports = ParamsMapper
