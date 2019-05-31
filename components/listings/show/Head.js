import {
  Component,
  Fragment
} from 'react'
import NextHead from 'components/shared/NextHead'
import {
  mainListingImage,
  imageUrl
} from 'utils/image_url'
import {buildSlug} from 'lib/listings'
import {
  SchemaWebSite,
  SchemaRealEstateAgent,
  SchemaOrganization
} from 'constants/ld-json'

const BASE_URL = 'https://www.emcasa.com'

export default class ListingHead extends Component {
  render() {
    const {
      listing: {matterportCode, type, images, address, rooms, area, price, id},
      listing
    } = this.props
    const {routerAsPath} = this.props
    const name = `${type} à venda na ${address.street} - ${address.neighborhood}, ${address.city} - ID${id}`
    const seoImgSrc = mainListingImage(images)

    const description = `Conheça ${
      matterportCode ? 'com Tour Virtual 3D' : ''
    } ${type.charAt(type.length - 1)} ${type} na ${address.street}, ${
      address.neighborhood
    }, ${address.city} - ${rooms} dormitórios, ${area} metros quadrados, R$ ${
      price ? price.toLocaleString('pt-BR') : 0
    },00 - ID${id}`

    const photos = []
    images.map((img, imgIndex) => {
      photos.push({
        '@type': 'ImageObject',
        'url': imageUrl(img.filename),
        'name': `Foto ${imgIndex + 1} - ${name}`
      })
    })

    return (
      <Fragment>
        <NextHead
          title={`${name} | EmCasa`}
          description={description}
          imageSrc={seoImgSrc}
          imageWidth={'1024'}
          imageHeight={'768'}
          url={`${BASE_URL}${routerAsPath}`}
          canonical={`${BASE_URL}${routerAsPath}`}
        >
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
        </NextHead>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SchemaWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SchemaRealEstateAgent) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SchemaOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'Casa' ? 'House' : 'Apartment',
            '@id': 'https://www.emcasa.com' + buildSlug(listing),
            'url': 'https://www.emcasa.com' + buildSlug(listing),
            'name': name,
            'description': description,
            'address': {
              '@context': 'http://schema.org',
              '@type': 'PostalAddress',
              'streetAddress': address.street,
              'addressLocality': address.city,
              'addressRegion': address.state,
              'addressCountry': 'BR'
            },
            'photo': photos,
            'image': photos,
            'numberOfRooms': rooms
          })}}
        />
      </Fragment>
    )
  }
}
