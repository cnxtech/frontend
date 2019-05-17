import {Component} from 'react'
import theme from '@emcasa/ui'
import Text from '@emcasa/ui-dom/components/Text'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import Button from 'components/shared/Common/Buttons'
import {Wrapper, Container, FavCount} from './styles'

class BuyBar extends Component {
  render() {
    const {user} = this.props
    return (
      <Wrapper>
        <Container>
          <FavCount>
            {user.authenticated && (
              <>
                <FontAwesomeIcon icon={faHeart} size="1x" />
                <Text fontSize={1}>Favoritos<Text fontSize={1} inline color="pink">4</Text></Text>
              </>
            )}
          </FavCount>
          <Button fontSize={1} icon={faSearch} noBorder iconColor={theme.colors.pink}>Filtro</Button>
        </Container>
      </Wrapper>
    )
  }
}

export default BuyBar
