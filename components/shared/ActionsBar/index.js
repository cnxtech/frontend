import {Component, Fragment} from 'react'
import Text from '@emcasa/ui-dom/components/Text'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import Filter from 'components/shared/Filter'
import {Wrapper, Container, FavCount} from './styles'

class ActionsBar extends Component {
  render() {
    const {user} = this.props
    return (
      <Wrapper>
        <Container>
          <FavCount>
            {user.authenticated && (
              <Fragment>
                <FontAwesomeIcon icon={faHeart} size="1x" />
                <Text fontSize={1}>Favoritos<Text fontSize={1} inline color="pink">4</Text></Text>
              </Fragment>
            )}
          </FavCount>
          <Filter onSubmit={this.props.onSubmit} filters={this.props.filters} />
        </Container>
      </Wrapper>
    )
  }
}

export default ActionsBar
