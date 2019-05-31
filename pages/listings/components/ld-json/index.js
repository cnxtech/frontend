import React, {Fragment, PureComponent} from 'react'
import {
  SchemaOrganization,
  SchemaRealEstateAgent,
  SchemaWebSite
} from 'constants/ld-json'

class LdJson extends PureComponent {
  static defaultProps = {
    path: '/imoveis'
  }

  static getWebPage = ({path}) => {
    let schema = {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      '@id': `https://www.emcasa.com${path}/#webpage`,
      url: `https://www.emcasa.com${path}`,
      name:
        'Apartamentos e Casas à venda na Zona Sul do Rio de Janeiro e em São Paulo',
      description:
        'Conheça e Compre Apartamentos e Casas à venda na Zona Sul do Rio de Janeiro e em São Paulo com o sistema exclusivo de Tour Virtual 3D da Emcasa, a sua startup imobiliária.',
      breadcrumb: LdJson.getBreadcrumbList({path})
    }

    return schema
  }

  static getBreadcrumbList = ({path}) => {
    let itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': 'http://www.emcasa.com',
          url: 'http://www.emcasa.com',
          name: 'Página Inicial'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@id': `http://www.emcasa.com${path}`,
          url: `http://www.emcasa.com${path}`,
          name: 'Comprar imóvel'
        }
      }
    ]

    return {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemListElement
    }
  }

  render() {
    return (
      <Fragment>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SchemaWebSite)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SchemaRealEstateAgent)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SchemaOrganization)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LdJson.getWebPage(this.props))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LdJson.getBreadcrumbList(this.props))
          }}
        />
      </Fragment>
    )
  }
}

export default LdJson
