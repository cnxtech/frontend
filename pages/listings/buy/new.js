import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import {getCookie} from 'lib/session'
import {hoistStatics, compose} from 'recompose'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import {withUserLocation} from 'components/providers/Location'
import NextHead from 'components/shared/NextHead'
import BuyHeader from 'components/listings/buy/BuyHeader'
import BuyBar from 'components/shared/BuyBar'
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
  state = {
    userFeed: {},
    cityFeed: {}
  }

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

  static getDerivedStateFromProps({userLocation, router}, state) {
    const city = (router.query || {}).city
    const userCity = userLocation.citySlug || DEFAULT_CITY_SLUG
    const nextState = {city, userCity}
    if (userCity !== state.userCity)
      nextState.userFeed =
        CONTENT[(userCity || '').replace(/[^a-z]/g, '')] || {}
    if (city !== state.city)
      nextState.cityFeed = CONTENT[(city || '').replace(/[^a-z]/g, '')] || {}
    return nextState
  }

  render() {
    const {user} = this.props
    const {userCity, userFeed, city, cityFeed} = this.state
    let headContent = cityFeed.seo || {
      seoURL: 'http://www.emcasa.com',
      seoImg: imageUrl('buy'),
      seoTitle: `${BASE_TITLE} no Rio de Janeiro e São Paulo | EmCasa`,
      seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em toda Zona Sul ou em São Paulo ${BASE_DESCRIPTION}`
    }

    return (
      <FlagrProvider flagrFlags={this.props.flagrFlags}>
        <Fragment>
          <NextHead
            title={headContent.seoTitle}
            description={headContent.seoDescription}
            imageSrc={headContent.seoImg}
            imageWidth={'1476'}
            imageHeight={'838'}
            url={headContent.seoURL}
          />
          <BuyHeader />
          <BuyBar user={user} />
          {cityFeed.feed &&
            cityFeed.feed.map((item, index) => {
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
          {userFeed.feed &&
            userFeed.feed.map((item, index) => {
              return (
                <ListingFeed
                  client
                  key={index}
                  highlight={item.highlight}
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

export default hoistStatics(compose(withBreakpoint(), withUserLocation))(
  HomePage
)
