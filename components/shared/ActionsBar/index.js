import {Component, Fragment} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Text from '@emcasa/ui-dom/components/Text'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import Filter from 'components/shared/Filter'
import {Wrapper, Container, FavCount} from './styles'
import {DEFAULT_CITY} from 'utils/location-utils'
import {FAVORITES_TAB} from 'pages/user/profile'

class ActionsBar extends Component {
  render() {
    const {user, onSubmit, filters, currentCity, favorites} = this.props
    return (
      <Wrapper>
        <Container>
          <Link href={`/meu-perfil?tab=${FAVORITES_TAB}`}>
            <FavCount>
              {user.authenticated && (
                <Fragment>
                  <FontAwesomeIcon icon={faHeart} size="1x" />
                  <Text fontSize={1}>
                    Favoritos<Text fontSize={1} inline color="pink">
                      {favorites ? favorites.length : 0}
                    </Text>
                  </Text>
                </Fragment>
              )}
            </FavCount>
          </Link>
          <Filter
            onSubmit={onSubmit}
            filters={filters}
            currentCity={currentCity}
          />
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
