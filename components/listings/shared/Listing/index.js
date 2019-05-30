import React from 'react'
import Router from 'next/router'
import isEqual from 'lodash/isEqual'
import NumberFormat from 'react-number-format'
import {canEdit} from 'permissions/listings-permissions'
import Link from 'next/link'
import ImageContainer from './ImageContainer'
import EmCasaButton from 'components/shared/Common/Buttons'
import TextContainer from './TextContainer'
import humps from 'humps'
import ListingWrapper, {
  ListingInfo,
  ListingInfoMobile,
  ListingContainer,
  ListingActions,
  LikeButtonContainer
} from './styles'
import {buildSlug} from 'lib/listings'
import LikeButton from 'components/shared/Common/Buttons/Like'

class Listing extends React.Component {
  handleListingClick = () => {
    const {listing} = this.props
    Router.push(`/listings/show?id=${listing.id}`, buildSlug(listing)).then(
      () => window.scrollTo(0, 0)
    )
  }

  render() {
    let {
      listing,
      currentUser,
      favorited: favoritedListings,
      highlight,
      onMouseEnter,
      onMouseLeave,
      resumedInfo
    } = this.props
    listing = humps.decamelizeKeys(listing)

    const highlighListing = isEqual(highlight, {
      lat: listing.address.lat,
      lng: listing.address.lng
    })

    const favorited =
      favoritedListings.filter(
        (actual) => actual.id.toString() === listing.id.toString()
      ).length > 0

    return (
      <ListingWrapper aria-label={`listing-${listing.id}`}>
        <Link
          href={`/listings/show?id=${listing.id}`}
          as={buildSlug(listing)}
          passHref
        >
          <a className="GTAG">
            <ListingContainer
              onMouseEnter={onMouseEnter && onMouseEnter.bind(this, listing)}
              onMouseLeave={onMouseLeave && onMouseLeave.bind(this, listing)}
              highlight={highlighListing}
              resumedInfo={resumedInfo}
            >
              <ImageContainer
                currentUser={currentUser}
                listing={listing}
                favorite={favorited}
                resumedInfo={resumedInfo}
              />
              <TextContainer
                favorite={favorited}
                listing={listing}
                currentUser={currentUser}
                resumedInfo={resumedInfo}
              />

              <ListingInfo resumedInfo={resumedInfo}>
                <NumberFormat
                  value={listing.price}
                  displayType={'text'}
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                />
              </ListingInfo>
              <ListingInfoMobile resumedInfo={resumedInfo}>
                <span className="address">{listing.address.street}</span>
                <span>
                  <NumberFormat
                    value={listing.price}
                    displayType={'text'}
                    thousandSeparator={'.'}
                    prefix={'R$'}
                    decimalSeparator={','}
                  />
                </span>
              </ListingInfoMobile>
            </ListingContainer>
          </a>
        </Link>
        <LikeButtonContainer resumedInfo={resumedInfo}>
          <LikeButton
            favorite={favorited}
            listing={listing}
            user={currentUser}
            search={true}
          />
        </LikeButtonContainer>

        <ListingActions resumedInfo={resumedInfo}>
          {canEdit(currentUser, listing) && (
            <Link
              href={`/listings/edit?id=${listing.id}`}
              as={`/imoveis/${listing.id}/editar`}
              passHref
            >
              <a>
                <EmCasaButton secondary>Editar</EmCasaButton>
              </a>
            </Link>
          )}

          <Link
            href={`/listings/show?id=${listing.id}`}
            as={buildSlug(listing)}
            passHref
          >
            <a>
              <EmCasaButton>Ver Detalhes</EmCasaButton>
            </a>
          </Link>
        </ListingActions>
      </ListingWrapper>
    )
  }
}

export default Listing
