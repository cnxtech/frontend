import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import NextHead from 'components/shared/NextHead'
import BuyHeader from 'components/listings/buy/BuyHeader'
import BuyBar from 'components/listings/buy/BuyBar'
import CityLists from 'components/listings/buy/CityLists'
import ListingFeed from 'components/shared/Listing/Feed'

class HomePage extends Component {
  render() {
    const {client, router, url, user} = this.props
    const BASE_TITLE = 'Imóveis, Casas e Apartamentos à Venda'
    const BASE_DESCRIPTION =
      'com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.'

    const all = {
      seoURL: 'http://www.emcasa.com',
      seoImg: imageUrl('buy'),
      seoTitle: `${BASE_TITLE} no Rio de Janeiro e São Paulo | EmCasa`,
      seoDescription: `Encontre ${BASE_TITLE} no Rio de Janeiro em toda Zona Sul ou em São Paulo ${BASE_DESCRIPTION}`
    }

    const HOME_FEED = [
      {
        title: 'Adicionados recentemente em São Paulo',
        variables: {
          pagination: {
            pageSize: 4
          },
          filters: {
            types: ['casa']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis',
          label: 'Ver outros imóveis recentes'
        }
      },
      {
        title: 'Apartamentos com max 500',
        variables: {
          pagination: {
            pageSize: 4
          },
          filters: {
            types: ['Apartamento']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis',
          label: 'Apartamentos com max 500'
        }
      },
      {
        title: 'Imóveis com mais de 100mts',
        variables: {
          pagination: {
            pageSize: 4
          },
          filters: {
            types: ['Cobertura']
          }
        },
        button: {
          href: '/listings',
          as: '/imoveis',
          label: 'Imóveis com mais de 100mts'
        }
      }
    ]

    return (
      <Fragment>
        <NextHead
          title={all.seoTitle}
          description={all.seoDescription}
          imageSrc={all.seoImg}
          imageWidth={'1476'}
          imageHeight={'838'}
          url={all.seoURL}
        />
        <BuyHeader />
        <BuyBar user={user} />
        {HOME_FEED.map((item, index) => {
          return (
            <ListingFeed
              key={index}
              highlight
              currentUser={user}
              button={item.button}
              variables={item.variables}
              title={item.title}
            />
          )
        })}
        <CityLists />
      </Fragment>
    )
  }
}

export default HomePage
