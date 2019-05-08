const mapToParams = require('./url-to-params-mapper')
const mapToUrl = require('./params-to-url-mapper')

class ParamsMapper {
  static mapUrlToParams(params) {
    return mapToParams(params)
  }
  static mapParamsToUrl(params, filters) {
    return mapToUrl(params, filters)
  }
}

module.exports = ParamsMapper
