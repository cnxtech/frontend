import url from 'url'
import {Component} from 'react'
import Head from 'next/head'
import Router from 'next/router'
import {withApollo, compose} from 'react-apollo'
import withData from '/lib/apollo/withData'
import {Query} from 'react-apollo'
import {GET_FAVORITE_LISTINGS} from 'graphql/user/queries'

import {treatParams} from 'utils/filter-params.js'
import {mainListingImage} from 'utils/image_url'
import {
  isAuthenticated,
  isAdmin,
  getCurrentUserId,
  redirectIfNotAuthenticated
} from 'lib/auth'
import {getNeighborhoods} from 'services/neighborhood-api'
import Layout from 'components/shared/Shell'
import InfiniteScroll from 'components/shared/InfiniteScroll'
import MapContainer from 'components/listings/index/Map'
import Listing from 'components/listings/index/Listing'
import ListingsNotFound from 'components/listings/index/NotFound'
import Filter from 'components/listings/index/Search'

import {mobileMedia} from 'constants/media'
import {desktopHeaderHeight, desktopFilterHeight} from 'constants/dimensions'
const splitParam = (param) => (param ? param.split('|') : [])

const getDerivedParams = (query) => ({
  price: {
    min: query.preco_minimo,
    max: query.preco_maximo
  },
  area: {
    min: query.area_minima,
    max: query.area_maxima
  },
  rooms: {
    min: query.quartos_minimo,
    max: query.quartos_maximo
  },
  neighborhoods: splitParam(query.bairros)
})

class ListingsFav extends Component {
  state = {
    query: {}
  }
  static async getInitialProps(context) {
    if (redirectIfNotAuthenticated(context)) {
      return {}
    }
    const neighborhoods = await getNeighborhoods().then(
      ({data}) => data.neighborhoods
    )

    return {
      neighborhoods,
      currentUser: {
        id: getCurrentUserId(context),
        admin: isAdmin(context),
        authenticated: isAuthenticated(context)
      }
    }
  }

  componentDidMount() {
    require('utils/polyfills/smooth-scroll').load()
    Router.onRouteChangeStart = this.onUpdateRoute
  }

  componentWillUnmount() {
    Router.onRouteChangeStart = undefined
  }

  onUpdateRoute = (requestPath) => {
    const {query} = url.parse(requestPath, true)
    this.setState({query})
  }

  onSelectListing = (id) => {
    const element = document.getElementById(`listing-${id}`)
    const rect = element.getBoundingClientRect()
    const top = rect.top - desktopHeaderHeight - desktopFilterHeight
    window.scrollBy({top, behavior: 'smooth'})
  }

  onChangeFilter = (name, value) => {
    const params = treatParams({
      ...this.params,
      [name]: value
    })

    if (params) {
      Router.replace(`/listings/fav?${params}`, `/imoveis/favoritos?${params}`)
    } else {
      Router.replace('/listings/fav', '/imoveis/favoritos')
    }
  }

  onResetFilter = () => Router.push('/listings/fav', '/imoveis/favoritos')

  get params() {
    return getDerivedParams(this.props.url.query)
  }

  filteredListings = (serverListings) => {
    const {
      query: {
        preco_minimo,
        preco_maximo,
        area_minima,
        area_maxima,
        quartos_minimo,
        quartos_maximo,
        bairros
      }
    } = this.state

    return serverListings.filter(
      ({price, rooms, area, address: {neighborhood}}) => {
        let returnListing = true
        if (preco_minimo && price < parseInt(preco_minimo))
          returnListing = false

        if (preco_maximo && price > parseInt(preco_maximo))
          returnListing = false

        if (area_minima && area < parseInt(area_minima)) returnListing = false
        if (area_maxima && area > parseInt(area_maxima)) returnListing = false

        if (quartos_minimo && rooms < parseInt(quartos_minimo))
          returnListing = false
        if (quartos_maximo && rooms > parseInt(quartos_maximo))
          returnListing = false

        if (bairros && bairros.split('|').indexOf(neighborhood) === -1)
          returnListing = false

        return returnListing
      }
    )
  }

  render() {
    const {params, filteredListings} = this
    const {neighborhoods, currentUser, query} = this.props
    const seoImgSrc = this.seoImage
    return (
      <Layout
        authenticated={currentUser.authenticated}
        isAdmin={currentUser.admin}
      >
        <Query query={GET_FAVORITE_LISTINGS} skip={!currentUser.authenticated}>
          {({data, loading, error}) => {
            if (loading) return ''
            if (error) return `Erro: ${error.message}`

            const listings = filteredListings(data.favoritedListings || [])

            return (
              <div className="listings">
                <Head>
                  <title>Imóveis favoritos | EmCasa</title>
                  <meta name="description" content="Meus imóveis favoritos" />
                  <meta
                    property="og:description"
                    content="Meus imóveis favoritos"
                  />
                  <meta
                    property="og:image"
                    content={
                      listings[0] && mainListingImage(listings[0].images)
                    }
                  />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta
                    name="twitter:title"
                    content="Meus imóveis favoritos | EmCasa"
                  />
                  <meta
                    name="twitter:description"
                    content="Meus imóveis favoritos"
                  />
                  <meta name="twitter:image" content={seoImgSrc} />
                </Head>
                <Filter
                  params={params}
                  neighborhoods={neighborhoods}
                  onChange={this.onChangeFilter}
                  onReset={this.onResetFilter}
                />

                <div className="map">
                  <MapContainer
                    zoom={13}
                    onSelect={this.onSelectListing}
                    listings={listings}
                  />
                </div>

                <div className="entries-container">
                  {listings.length == 0 ? (
                    <ListingsNotFound resetAllParams={this.onResetFilter} />
                  ) : (
                    <InfiniteScroll
                      title="Meus imóveis favoritos"
                      currentPage={1}
                      totalPages={1}
                      entries={listings}
                      to={{pathname: '/imoveis/favoritos', query}}
                    >
                      {(listing) => (
                        <Listing
                          key={listing.id}
                          id={`listing-${listing.id}`}
                          listing={listing}
                          currentUser={currentUser}
                          loading={loading}
                          favorited={listings}
                        />
                      )}
                    </InfiniteScroll>
                  )}
                </div>
                <style jsx>{`
                  .listings {
                    > div {
                      float: left;
                      width: 60%;
                      &.entries-container {
                        float: right;
                        margin-top: ${desktopFilterHeight}px;
                      }
                    }
                  }

                  .map {
                    background: white;
                    border-radius: 8px;
                    height: calc(100vh - 178px);
                    margin-left: 20px;
                    overflow: hidden;
                    position: fixed !important;
                    top: 158px;
                    width: calc(40% - 40px) !important;
                  }

                  @media ${mobileMedia} {
                    .listings > div:first-of-type {
                      display: none;
                    }

                    .listings > div.entries-container {
                      width: 100%;
                    }

                    .map {
                      display: none;
                    }
                  }
                `}</style>
              </div>
            )
          }}
        </Query>
      </Layout>
    )
  }
}

export default compose(
  // withData gives us server-side graphql queries before rendering
  withData,
  // withApollo exposes `this.props.client` used when logging out
  withApollo
)(ListingsFav)