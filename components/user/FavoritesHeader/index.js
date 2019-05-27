import React from 'react'
import Router from 'next/router'
import Row from '@emcasa/ui-dom/components/Row'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'
import Button from '@emcasa/ui-dom/components/Button'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import Container, {Main} from './styles'
import {
  log,
  PROFILE_FAVORITES_GO_TO_HOME
} from 'lib/logging'

export default React.forwardRef(function UserFavoritesHeader(props, ref) {
  const {favorites, viewIcon, viewLabel, onInterestCreate, onClickView} = props
  return (
    <Container ref={ref}>
      <Main>
        <Row
          maxWidth={LISTING_MAX_WIDTH}
          width="100%"
          m="auto"
          p={2}
          justifyContent="space-between"
          style={{boxSizing: 'border-box'}}
        >
          <Row alignItems="center">
            <Icon mr={1} name="heart" color="pink" size={16} />
            <Text inline mr={1} fontSize="small">
              Favoritos
            </Text>
            <View mr={1} />
            <Text inline fontSize="small" color="pink">
              {favorites.length}
            </Text>
          </Row>
          <Row
            as="a"
            onClick={onClickView}
            style={{cursor: 'pointer'}}
            alignItems="center"
          >
            <Icon mr={1} name={viewIcon} color="blue" size={16} />
            <Text inline fontSize="small">
              {viewLabel}
            </Text>
          </Row>
        </Row>
      </Main>

      <Row
        maxWidth={LISTING_MAX_WIDTH}
        width="100%"
        m="auto"
        p={2}
        pt={4}
        pb={4}
        flexDirection={['column', null, null, 'row']}
        alignItems="center"
        justifyContent="space-between"
        style={{boxSizing: 'border-box'}}
      >
        <Text inline fontSize="small">
          Você tem{' '}
          <Text inline color="pink" fontSize="small">
            {favorites.length}
          </Text>{' '}
          imóveis salvos
        </Text>
        <Row width={['100%', null, null, 'auto']} mt={[2, null, null, 0]}>
          <Button
            className="desktop-only"
            mr={2}
            fontSize="small"
            onClick={() => {
              log(PROFILE_FAVORITES_GO_TO_HOME)
              Router.push('/')
            }}
          >
            Voltar para home
          </Button>
          <Button
            active
            flex={1}
            fontSize="small"
            fontWeight="bold"
            onClick={onInterestCreate}
          >
            Falar com Especialista
          </Button>
        </Row>
      </Row>
    </Container>
  )
})
