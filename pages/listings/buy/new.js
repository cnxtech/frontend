import {Component, Fragment} from 'react'
import {imageUrl} from 'utils/image_url'
import NextHead from 'components/shared/NextHead'
import ListingBuyHeader from 'components/listings/buy/BuyHeader'
import ListingFeed from 'components/shared/Listing/Feed'

class Homepage extends Component {
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

    const feedButton = {
      href: '/listings',
      as: '/imoveis',
      label: 'Em Casa'
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
        neighborhoodsSlugs: ['urca']
      }
    }

    const feedVariablesC = {
      pagination: {
        pageSize: 4
      },
      filters: {
        neighborhoodsSlugs: ['joa']
      }
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
          button={feedButton}
          variables={feedVariablesA}
          title="Outros"
        />
        <ListingFeed
          currentUser={user}
          button={feedButton}
          variables={feedVariablesB}
          title="Outros"
        />
        <ListingFeed
          currentUser={user}
          button={feedButton}
          variables={feedVariablesC}
          title="Outros"
        />
      </Fragment>
    )
  }
}

export default Homepage
