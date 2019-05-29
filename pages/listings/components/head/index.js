import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {getTitleTextByParams} from 'components/listings/shared/ListingList/title'
import NextHead from 'components/shared/NextHead'
import {imageUrl} from 'utils/image_url'

class ListingsHead extends PureComponent {
  static BASE_URL = 'https://www.emcasa.com/imoveis'
  static propTypes = {
    districts: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    url: PropTypes.object.isRequired
  }

  getCanonical = () => {
    const {filters, districts} = this.props
    if (filters.neighborhoods && filters.neighborhoods.length === 1) {
      const info = districts.find(
        (a) => a.nameSlug === filters.neighborhoods[0]
      )
      return info && info.stateSlug
        ? `/${info.stateSlug}/${info.citySlug}/${info.nameSlug}`
        : `${ListingsHead.BASE_URL}`
    }
    return null
  }

  getURL = () => {
    const {params, url: {asPath}} = this.props
    const {state, city, neighborhood} = params
    const startParams = asPath.indexOf('?')
    const urlParams =
      startParams && startParams !== -1
        ? asPath.slice(startParams, asPath.length)
        : ''
    let url = ListingsHead.BASE_URL

    if (neighborhood) {
      url += `/${state}/${city}/${neighborhood}`
    } else if (city) {
      url += `/${state}/${city}`
    } else if (state) {
      url += `/${state}`
    }
    return url.concat(urlParams)
  }

  getImageSrc = () => {
    const {params: {state}} = this.props
    let imgSrc = state ? `buy-${state}` : 'buy'

    return imageUrl(imgSrc)
  }

  render() {
    const titleContent = getTitleTextByParams(this.props.params, this.props.districts)
    const imageSrc = this.getImageSrc()
    const url = this.getURL()
    const canonical = this.getCanonical()

    return (
      <NextHead
        title={`${titleContent} | EmCasa`}
        description={`Conheça e Compre Apartamentos e Casas à venda ${titleContent} com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.`}
        imageSrc={imageSrc}
        url={url}
        canonical={canonical}
      />
    )
  }
}

export default ListingsHead
