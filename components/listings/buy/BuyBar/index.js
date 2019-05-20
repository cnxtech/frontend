import {Component, Fragment} from 'react'
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
              <Fragment>
                <FontAwesomeIcon icon={faHeart} size="1x" />
                <Text fontSize={1}>Favoritos<Text fontSize={1} inline color="pink">4</Text></Text>
              </Fragment>
            )}
          </FavCount>
          <Button fontSize={1} noBorder iconColor={theme.colors.pink}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16">
              <g fill="none" fillRule="evenodd">
                <path d="M-2-4h24v24H-2z"/>
                <path
                  stroke={theme.colors.pink}
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M19.5 3.5H6h13.5zm-4.5 9H1.10546875 15zM3.5 6C2.11928813 6 1 4.88071187 1 3.5S2.11928813 1 3.5 1 6 2.11928813 6 3.5 4.88071187 6 3.5 6zm14 9c-1.3807119 0-2.5-1.1192881-2.5-2.5s1.1192881-2.5 2.5-2.5 2.5 1.1192881 2.5 2.5-1.1192881 2.5-2.5 2.5z"
                />
              </g>
            </svg>
            Filtro
          </Button>
        </Container>
      </Wrapper>
    )
  }
}

export default BuyBar
