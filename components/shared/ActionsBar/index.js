import {Component} from 'react'
import Link from 'next/link'
import {graphql} from 'react-apollo'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Icon from '@emcasa/ui-dom/components/Icon'
import Filter from 'components/shared/Filter'
import {Wrapper, Container, FavCount} from './styles'
import {DEFAULT_CITY} from 'utils/location-utils'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import ActionButton from './Button'

class ActionsBar extends Component {
  static Button = ActionButton

  static defaultProps = {
    favorites: [],
    currentCity: DEFAULT_CITY
  }

  static propTypes = {
    filters: PropTypes.object,
    currentCity: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    favorites: PropTypes.array,
    isFavoritesPage: PropTypes.bool
  }

  getFavoritesCountDisplay() {
    const {user, favorites, isFavoritesPage} = this.props
    if (user && user.authenticated && !isFavoritesPage) {
      return (
        <Link passHref href={'/meu-perfil/favoritos'}>
          <a>
            {this.favoritesCount(user, favorites)}
          </a>
        </Link>
      )
    }
    return this.favoritesCount(user, favorites)
  }

  favoritesCount = (user, favorites) => {
    const {isFavoritesPage} = this.props
    return (
      <FavCount authenticated={user && user.authenticated}>
        <Icon
          mr={2}
          name="heart"
          type={isFavoritesPage ? 'default' : 'light'}
          size={20}
          color={isFavoritesPage ? 'pink' : 'dark'}
        />
        <Text fontSize={1}>
          Favoritos
          {String.fromCharCode(0x00a0)}
          <Text fontSize={1} inline color="pink">
            {favorites.length}
          </Text>
        </Text>
      </FavCount>
    )
  }

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

export default compose(
  graphql(GET_USER_LISTINGS_ACTIONS, {
    skip: ({user, favorites}) => !user.authenticated || favorites,
    props: ({data: {userProfile}}) => ({
      favorites: (userProfile && userProfile.favorites) || []
    })
  })
)(ActionsBar)
