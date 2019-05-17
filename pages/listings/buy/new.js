import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import NextHead from 'components/shared/NextHead'
import BuyHeader from 'components/listings/buy/BuyHeader'
import BuyBar from 'components/listings/buy/BuyBar'
import CityLists from 'components/listings/buy/CityLists'
import ListingFeed from 'components/shared/Listing/Feed'

class HomePage extends Component {
  render() {
    const {router, user} = this.props
    const city = (router.query || {}).city || 'all'

    const BASE_TITLE = 'Imóveis, Casas e Apartamentos à Venda'
    const BASE_DESCRIPTION =
      'com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.'
    const CONTENT = {
      all: {
        cities: ['sao-paulo', 'rio-de-janeiro'],
        seoURL: 'http://www.emcasa.com',
        seoImg: imageUrl('buy'),
        seoTitle: `${BASE_TITLE} no Rio de Janeiro e São Paulo | EmCasa`,
        seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em toda Zona Sul ou em São Paulo ${BASE_DESCRIPTION}`,
        feed: [
          {
            highlight: true,
            title: 'Adicionados recentemente em São Paulo e no Rio de Janeiro',
            filters: {
              types: ['Apartamentos'],
              citiesSlug: ['sao-paulo', 'rio-de-janeiro']
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros imóveis recentes'
            }
          },
          {
            title: 'Apartamentos em São Paulo e no Rio de Janeiro',
            filters: {
              types: ['Apartamentos'],
              citiesSlug: [city]
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros apartamentos'
            }
          }
        ]
      },
      saopaulo: {
        cities: [city],
        seoURL: 'http://www.emcasa.com/sao-paulo',
        seoImg: imageUrl('buy-sp'),
        seoTitle: `${BASE_TITLE} em São Paulo | EmCasa`,
        seoDescription: `Encontre ${BASE_TITLE} em São Paulo ${BASE_DESCRIPTION}`,
        feed: [
          {
            highlight: true,
            title: 'Adicionados recentemente em São Paulo',
            filters: {
              citiesSlug: [city]
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros imóveis recentes'
            }
          },
          {
            title: 'Apartamentos em São Paulo',
            filters: {
              types: ['Apartamentos'],
              citiesSlug: [city]
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros apartamentos'
            }
          }
        ]
      },
      riodejaneiro: {
        cities: [city],
        seoURL: 'http://www.emcasa.com/rio-de-janeiro',
        seoImg: imageUrl('buy-rj'),
        seoTitle: `${BASE_TITLE} no Rio de Janeiro | EmCasa`,
        seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em Ipanema, Leblon, Copacabana, Botafogo, Flamengo, Lagoa e toda Zona Sul ${BASE_DESCRIPTION}`,
        feed: [
          {
            highlight: true,
            title: 'Adicionados recentemente no Rio de Janeiro',
            filters: {
              types: ['Apartamentos'],
              citiesSlug: [city]
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros imóveis recentes'
            }
          },
          {
            title: 'Apartamentos no Rio de Janeiro',
            filters: {
              types: ['Apartamentos'],
              citiesSlug: [city]
            },
            button: {
              href: '/listings',
              as: '/imoveis',
              label: 'Ver outros apartamentos'
            }
          }
        ]
      }
    }

    const CITY_CONTENT = CONTENT[city.replace(/[^a-z]/g, '')]

    return (
      <Fragment>
        <NextHead
          title={CITY_CONTENT.seoTitle}
          description={CITY_CONTENT.seoDescription}
          imageSrc={CITY_CONTENT.seoImg}
          imageWidth={'1476'}
          imageHeight={'838'}
          url={CITY_CONTENT.seoURL}
        />
        <BuyHeader />
        <BuyBar user={user} />
        {CITY_CONTENT.feed.map((item, index) => {
          return (
            <ListingFeed
              key={index}
              highlight={index === 0}
              currentUser={user}
              button={item.button}
              variables={{
                ...item.variables,
                pagination: {
                  pageSize: 4
                }
              }}
              title={item.title}
            />
          )
        })}
        <CityLists city={city} />
      </Fragment>
    )
  }
}

export default HomePage
