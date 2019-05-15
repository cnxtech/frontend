import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import NextHead from 'components/shared/NextHead'
import ListingBuyHeader from 'components/listings/buy/BuyHeader'
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

    const feedVariablesA = {
      pagination: {
        pageSize: 4
      },
      filters: {
        neighborhoodsSlugs: ['perdizes']
      }
    }

    const feedVariablesB = {
      pagination: {
        pageSize: 4
      },
      filters: {
        neighborhoodsSlugs: ['sumare']
      }
    }

    const feedVariablesC = {
      pagination: {
        pageSize: 4
      },
      filters: {
        neighborhoodsSlugs: ['pinheiros']
      }
    }

    const feedButtonA = {
      href: '/listings',
      as: '/imoveis',
      label: 'Ver outros imóveis recentes'
    }

    const feedButtonB = {
      href: '/listings',
      as: '/imoveis',
      label: 'Ver outros imóveis de incorporadoras'
    }

    const feedButtonC = {
      href: '/listings',
      as: '/imoveis',
      label: 'Ver outros imóveis com varanda'
    }

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
        <ListingBuyHeader />
        <ListingFeed
          highlight
          currentUser={user}
          button={feedButtonA}
          variables={feedVariablesA}
          title="Adicionados recentemente em São Paulo"
        />
        <ListingFeed
          currentUser={user}
          button={feedButtonB}
          variables={feedVariablesB}
          title="Imóveis de incorporadoras"
        />
        <ListingFeed
          currentUser={user}
          button={feedButtonC}
          variables={feedVariablesC}
          title="Imóveis pra quem gosta de varanda"
        />
        <CityLists />
      </Fragment>
    )
  }
}

export default HomePage
