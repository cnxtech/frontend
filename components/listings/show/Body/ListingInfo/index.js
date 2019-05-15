import uniq from 'lodash/uniq'
import React from 'react'
import PropTypes from 'prop-types'
import theme from 'config/theme'
import NumberFormat from 'react-number-format'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import faCube from '@fortawesome/fontawesome-free-solid/faCube'
import faMap from '@fortawesome/fontawesome-free-solid/faMap'
import ButtonIcon from 'components/shared/Common/Buttons'
import faStreetView from '@fortawesome/fontawesome-free-solid/faStreetView'

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

class ListingInfo extends React.Component {
  render() {
    const {
      title,
      listing,
      openMatterportPopup,
      openMapPopup,
      openStreetViewPopup
    } = this.props
    const {
      matterportCode,
      type,
      price,
      maintenanceFee,
      propertyTax,
      rooms,
      bathrooms,
      garageSpots,
      area,
      suites,
      floor
    } = listing
    const pricePerSquareMeter = Math.floor(price / area / 100) * 100
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
          {rooms ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{rooms}</Text>
              <Text fontSize={[1, null, null, 2]}>dorm.</Text>
            </ValuesItem>
          ) : null}
          {suites ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{suites}</Text>
              <Text fontSize={[1, null, null, 2]}>suítes</Text>
            </ValuesItem>
          ) : null}
          {bathrooms ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{bathrooms}</Text>
              <Text fontSize={[1, null, null, 2]}>banh.</Text>
            </ValuesItem>
          ) : null}
          {garageSpots ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{garageSpots}</Text>
              <Text fontSize={[1, null, null, 2]}>vagas</Text>
            </ValuesItem>
          ) : null}
          {area ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{area}</Text>
              <Text fontSize={[1, null, null, 2]}>área (m²)</Text>
            </ValuesItem>
          ) : null}
          {floor ? (
            <ValuesItem flexDirection="column">
              <Text fontSize={2}>{floor}</Text>
              <Text fontSize={[1, null, null, 2]}>andar</Text>
            </ValuesItem>
          ) : null}
        </ValuesContainer>
        <Row flexDirection="column" mt={5}>
          {Boolean(maintenanceFee) && (
            <PriceItem mb={2}>
              <Text inline>Condomínio</Text>
              <PriceItemSpacer />
              <NumberFormat
                value={maintenanceFee}
                displayType={'text'}
                thousandSeparator={'.'}
                prefix={'R$'}
                decimalSeparator={','}
              />
            </PriceItem>
          )}
          {Boolean(propertyTax) && (
            <PriceItem mb={2}>
              <Text inline>IPTU/ano</Text>
              <PriceItemSpacer />
              <NumberFormat
                value={propertyTax}
                displayType={'text'}
                thousandSeparator={'.'}
                prefix={'R$'}
                decimalSeparator={','}
              />
            </PriceItem>
          )}
          {Boolean(pricePerSquareMeter) && (
            <PriceItem>
              <Text inline>Preço/m²</Text>
              <PriceItemSpacer />
              <NumberFormat
                value={pricePerSquareMeter}
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
