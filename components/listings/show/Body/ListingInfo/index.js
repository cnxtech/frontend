import uniq from 'lodash/uniq'
import React from 'react'
import PropTypes from 'prop-types'
import theme from 'config/theme'
import NumberFormat from 'react-number-format'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import faCube from '@fortawesome/fontawesome-free-solid/faCube'
import faMap from '@fortawesome/fontawesome-free-solid/faMap'
import ButtonIcon from 'components/shared/Common/Buttons'
import faStreetView from '@fortawesome/fontawesome-free-solid/faStreetView'
import {formatRange} from 'utils/text-utils'
import {getListingValues, getListingValueRange} from 'lib/listings'

import {
  Container,
  Title,
  ExtraTitleSEO,
  ButtonsContainer,
  OpenMatterportButtonWrapper,
  PriceItem,
  PriceItemSpacer,
  ValuesContainer,
  ValuesItem
} from './styles'

const hasValues = (range = []) => range.find((val) => val && val > 0)

const isRange = ([min, max] = []) => min !== max

function NumberRangeFormat({values, ...props}) {
  if (!isRange(values)) return <NumberFormat value={values[0]} {...props} />
  return (
    <Text
      inline
      style={{display: 'inline-flex', alignItems: 'center'}}
      color="inherit"
      fontSize="75%"
    >
      <NumberFormat value={values[0]} {...props} />
      <Text inline style={{margin: '0 5px'}} color="grey" fontSize="small">
        -
      </Text>
      <NumberFormat value={values[1]} {...props} />
    </Text>
  )
}

class ListingInfo extends React.Component {
  render() {
    const {
      title,
      listing,
      openMatterportPopup,
      openMapPopup,
      openStreetViewPopup
    } = this.props
    const {matterportCode, type} = listing
    const price = getListingValueRange(listing, 'price')
    const maintenanceFee = getListingValueRange(listing, 'maintenanceFee')
    const propertyTax = getListingValueRange(listing, 'propertyTax')
    const rooms = getListingValueRange(listing, 'rooms')
    const bathrooms = getListingValueRange(listing, 'bathrooms')
    const garageSpots = getListingValueRange(listing, 'garageSpots')
    const area = getListingValueRange(listing, 'area')
    const suites = getListingValueRange(listing, 'suites')
    const floor = uniq(getListingValues(listing, 'floor'))
      .filter(Boolean)
      .map((num) => (isNaN(num) ? num : `${num}°`))
      .sort()
    const pricePerSquareMeter = [
      Math.floor(price[0] / area[0]),
      Math.floor(price[1] / area[1])
    ]
    return (
      <Container>
        <Title as="h2" fontWeight="bold">
          {listing.development && <span>{listing.development.name}</span>}
          <span
            style={{fontWeight: listing.development ? 'normal' : 'inherit'}}
          >
            <ExtraTitleSEO>{type} na </ExtraTitleSEO>
            {title}
          </span>
        </Title>
        <ButtonsContainer>
          {matterportCode && (
            <OpenMatterportButtonWrapper>
              <ButtonIcon
                onClick={openMatterportPopup}
                iconColor={theme.colors.white}
                color={theme.colors.white}
                backgroundColor={theme.colors.blue}
                noBorder
                icon={faCube}
              >
                Iniciar tour virtual
              </ButtonIcon>
            </OpenMatterportButtonWrapper>
          )}
          <ButtonIcon
            onClick={openMapPopup}
            iconColor={theme.colors.blue}
            icon={faMap}
          >
            Mapa
          </ButtonIcon>
          <ButtonIcon
            onClick={openStreetViewPopup}
            iconColor={theme.colors.blue}
            icon={faStreetView}
          >
            Rua
          </ButtonIcon>
        </ButtonsContainer>
        <ValuesContainer>
          {hasValues(rooms) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{formatRange(rooms)}</Text>
              <Text fontSize={[1, null, null, 2]}>dorm.</Text>
            </ValuesItem>
          ) : null}
          {hasValues(suites) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{formatRange(suites)}</Text>
              <Text fontSize={[1, null, null, 2]}>suítes</Text>
            </ValuesItem>
          ) : null}
          {hasValues(bathrooms) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{formatRange(bathrooms)}</Text>
              <Text fontSize={[1, null, null, 2]}>banh.</Text>
            </ValuesItem>
          ) : null}
          {hasValues(garageSpots) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{formatRange(garageSpots)}</Text>
              <Text fontSize={[1, null, null, 2]}>vagas</Text>
            </ValuesItem>
          ) : null}
          {hasValues(area) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{formatRange(area)}</Text>
              <Text fontSize={[1, null, null, 2]}>área (m²)</Text>
            </ValuesItem>
          ) : null}
          {hasValues(floor) ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{floor.join(', ')}</Text>
              <Text fontSize={[1, null, null, 2]}>andar</Text>
            </ValuesItem>
          ) : null}
        </ValuesContainer>
        <Row flexDirection="column" mt={5}>
          {hasValues(maintenanceFee) && (
            <PriceItem mb={2}>
              <Text inline>Condomínio</Text>
              <PriceItemSpacer />
              <NumberRangeFormat
                values={maintenanceFee}
                displayType={'text'}
                thousandSeparator={'.'}
                prefix={'R$'}
                decimalSeparator={','}
              />
            </PriceItem>
          )}
          {hasValues(propertyTax) && (
            <PriceItem mb={2}>
              <Text inline>IPTU/ano</Text>
              <PriceItemSpacer />
              <NumberRangeFormat
                values={propertyTax}
                displayType={'text'}
                thousandSeparator={'.'}
                prefix={'R$'}
                decimalSeparator={','}
              />
            </PriceItem>
          )}
          {hasValues(pricePerSquareMeter) && (
            <PriceItem>
              <Text inline>Preço/m²</Text>
              <PriceItemSpacer />
              <NumberRangeFormat
                values={pricePerSquareMeter}
                displayType={'text'}
                thousandSeparator={'.'}
                prefix={'R$'}
                decimalSeparator={','}
              />
            </PriceItem>
          )}
        </Row>
      </Container>
    )
  }
}

ListingInfo.propTypes = {
  listing: PropTypes.object,
  title: PropTypes.string,
  openMatterportPopup: PropTypes.func,
  openMapPopup: PropTypes.func,
  openStreetViewPopup: PropTypes.func
}

export default ListingInfo
