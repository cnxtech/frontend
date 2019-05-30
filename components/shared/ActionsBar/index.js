import {Component, Fragment} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import Filter from 'components/shared/Filter'
import {Wrapper, Container, FavCount} from './styles'
import {DEFAULT_CITY} from 'utils/location-utils'

class ActionsBar extends Component {
  getFavoritesCountDisplay() {
    const {user, favorites} = this.props
    if (user && user.authenticated) {
      return (
        <Link href={'/meu-perfil/favoritos'}>
          {this.favoritesCount(user, favorites)}
        </Link>
      )
    }
    return this.favoritesCount(user, favorites)
  }

  favoritesCount = (user, favorites) => (
    <FavCount authenticated={user && user.authenticated}>
      <Icon name="heart" size={16} />
      <Text fontSize={1}>
        Favoritos<Text fontSize={1} inline color="pink">
          {user && user.authenticated && favorites ? favorites.length : 0}
        </Text>
      </Text>
    </FavCount>
  )

  render() {
    const {button, onSubmit, filters, currentCity} = this.props
    return (
      <Wrapper>
        <Container>
          {this.getFavoritesCountDisplay()}
          <Row alignItems="center">
            {button}
            {Boolean(filters) && (
              <Filter
                onSubmit={onSubmit}
                filters={filters}
                currentCity={currentCity}
              />
            )}
          </Row>
        </Container>
      </Wrapper>
    )
  }
}

ActionsBar.defaultProps = {
  filters: {},
  currentCity: DEFAULT_CITY
}
ActionsBar.propTypes = {
  filters: PropTypes.object,
  currentCity: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  favorites: PropTypes.array
}
export default ActionsBar
