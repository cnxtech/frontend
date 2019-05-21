import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import {getCookie} from 'lib/session'
import slugify from 'slug'
import * as Sentry from '@sentry/browser'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import NextHead from 'components/shared/NextHead'
import BuyHeader from 'components/listings/buy/BuyHeader'
import BuyBar from 'components/listings/buy/BuyBar'
import CityLists from 'components/listings/buy/CityLists'
import ListingFeed from 'components/shared/Listing/Feed'
import {fetchFlag, DEVICE_ID_COOKIE} from 'components/shared/Flagr'
import FlagrProvider from 'components/shared/Flagr/Context'
import {TEST_SAVE_LISTING_TEXT} from 'components/shared/Flagr/tests'
import {DEFAULT_CITY_SLUG} from 'components/shared/NeighborhoodPicker'

const BASE_TITLE = 'Imóveis, Casas e Apartamentos à Venda'
const BASE_DESCRIPTION =
  'com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.'
const CONTENT = {
  saopaulo: {
    seo: {
      seoURL: 'http://www.emcasa.com/sao-paulo',
      seoImg: imageUrl('buy-sp'),
      seoTitle: `${BASE_TITLE} em São Paulo | EmCasa`,
      seoDescription: `Encontre ${BASE_TITLE} em São Paulo ${BASE_DESCRIPTION}`
    },
    feed: [
      {
        highlight: true,
        title: 'Adicionados recentemente em São Paulo',
        variables: {
          pagination: {pageSize: 4},
          filters: {
            maxPrice: 499000,
            citiesSlug: ['sao-paulo']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis/sp/sao-paulo',
          label: 'Ver outros imóveis recentes'
        }
      },
      {
        title: 'Apartamentos em São Paulo',
        variables: {
          pagination: {pageSize: 4},
          filters: {
            maxPrice: 499000,
            citiesSlug: ['sao-paulo']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis/sp/sao-paulo/apartamento',
          label: 'Ver outros apartamentos'
        }
      }
    ]
  },
  riodejaneiro: {
    seo: {
      seoURL: 'http://www.emcasa.com/rio-de-janeiro',
      seoImg: imageUrl('buy-rj'),
      seoTitle: `${BASE_TITLE} no Rio de Janeiro | EmCasa`,
      seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em Ipanema, Leblon, Copacabana, Botafogo, Flamengo, Lagoa e toda Zona Sul ${BASE_DESCRIPTION}`
    },
    feed: [
      {
        highlight: true,
        title: 'Adicionados recentemente no Rio de Janeiro',
        variables: {
          pagination: {pageSize: 4},
          filters: {
            maxPrice: 499000,
            citiesSlug: ['rio-de-janeiro']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis/rj/rio-de-janeiro',
          label: 'Ver outros imóveis recentes'
        }
      },
      {
        title: 'Apartamentos no Rio de Janeiro',
        variables: {
          pagination: {pageSize: 4},
          filters: {
            maxPrice: 499000,
            citiesSlug: ['rio-de-janeiro']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis/rj/rio-de-janeiro/apartamento',
          label: 'Ver outros apartamentos'
        }
      }
    ]
  }
}

class HomePage extends Component {
  static async getInitialProps(context) {
    // Flagr
    const deviceId = getCookie(DEVICE_ID_COOKIE, context.req)
    const flagrFlags = {
      [TEST_SAVE_LISTING_TEXT]: await fetchFlag(
        TEST_SAVE_LISTING_TEXT,
        deviceId
      )
    }

    return {
      flagrFlags
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      userCity: undefined,
      userFeed: undefined
    }
  }

  componentDidMount() {
    if (!process.browser) {
      return
    }

    const {router} = this.props
    const city = (router.query || {}).city

    if (!city) {
      fetch('/location', {method: 'POST'})
        .then((response) => response.json())
        .then((result) => {
          let userCity = this.getUserCityByGeoIp(result)
          if (userCity) {
            let identify = new amplitude.Identify().set('geoIpCity', userCity.name)
            amplitude.identify(identify)
          } else {
            userCity = DEFAULT_CITY_SLUG
          }
          this.setState({
            userCity: userCity,
            userFeed: CONTENT[userCity.replace(/[^a-z]/g, '')]
          })
        })
        .catch((e) => {
          Sentry.captureException(e)
          this.setState({
            userCity: DEFAULT_CITY_SLUG,
            userFeed: CONTENT[DEFAULT_CITY_SLUG.replace(/[^a-z]/g, '')]
          })
        })
    }
  }

  getUserCityByGeoIp = (result) => {
    if (result && result.location && result.location.city) {
      const {city} = result.location
      const citySlug = slugify(city.toLowerCase())
      return citySlug
    }
    return null
  }

  render() {
    const {router, user} = this.props
    const {userCity, userFeed} = this.state
    const city = (router.query || {}).city
    let HEAD_CONTENT = {
      seoURL: 'http://www.emcasa.com',
      seoImg: imageUrl('buy'),
      seoTitle: `${BASE_TITLE} no Rio de Janeiro e São Paulo | EmCasa`,
      seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em toda Zona Sul ou em São Paulo ${BASE_DESCRIPTION}`,
    }
    let CITY_CONTENT = {}

    if (city) {
      HEAD_CONTENT = CONTENT[city.replace(/[^a-z]/g, '')].seo
      CITY_CONTENT = CONTENT[city.replace(/[^a-z]/g, '')]
    }

    return (
      <FlagrProvider flagrFlags={this.props.flagrFlags}>
        <Fragment>
          <NextHead
            title={HEAD_CONTENT.seoTitle}
            description={HEAD_CONTENT.seoDescription}
            imageSrc={HEAD_CONTENT.seoImg}
            imageWidth={'1476'}
            imageHeight={'838'}
            url={HEAD_CONTENT.seoURL}
          />
          <BuyHeader />
          <BuyBar user={user} />
          {CITY_CONTENT.feed &&
            CITY_CONTENT.feed.map((item, index) => {
              return (
                <ListingFeed
                  key={index}
                  highlight={item.highlight}
                  title={item.title}
                  button={item.button}
                  currentUser={user}
                  variables={item.variables}
                />
              )
            })}
          {userFeed &&
            userFeed.feed.map((item, index) => {
              return (
                <ListingFeed
                  key={index}
                  highlight={item.highlight}
                  client={true}
                  title={item.title}
                  button={item.button}
                  currentUser={user}
                  variables={item.variables}
                />
              )
            })}
          {(city || userCity) && <CityLists city={city || userCity} />}
        </Fragment>
      </FlagrProvider>
    )
  }
}

export default withBreakpoint()(HomePage)
