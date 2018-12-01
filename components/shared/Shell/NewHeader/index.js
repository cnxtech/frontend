import {ThemeProvider} from 'styled-components'
import Link from 'next/link'
import theme from '@emcasa/ui'
import {Component} from 'react'
import Text from '@emcasa/ui-dom/components/Text'
import AccountKit from 'components/shared/Auth/AccountKit'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-pro-solid/faSearch'
import faFlag from '@fortawesome/fontawesome-pro-solid/faFlag'
import faUser from '@fortawesome/fontawesome-pro-solid/faUser'
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt'

import NeighborhoodAutoComplete from 'components/shared/NeighborhoodAutoComplete'
import MobileAddressButton from 'components/shared/MobileAddressButton'
import {MobieTypeaheadContainer} from 'components/shared/NeighborhoodAutoComplete/styles'

import Container, {
  Wrapper,
  Nav,
  Overlay,
  CloseNavButton,
  NavButton,
  MenuItem,
  Logo,
  ShortLogo
} from './styles'


export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sticky: false,
      isMobileNavVisible: false
    }
  }

  onScroll = () => {
    this.setState({sticky: window.scrollY > 100})
  }

  toggleMobileNavVisibility = () => {
    const {isMobileNavVisible} = this.state
    this.setState({isMobileNavVisible: !isMobileNavVisible})
  }


  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWilUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  renderSearch() {
    return (
      <NeighborhoodAutoComplete />
    )
  }

  render() {
    const {transparent, authenticated, search, router} = this.props
    const {sticky, isMobileNavVisible} = this.state
    const currentPath = router.asPath
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Container transparent={transparent} className={sticky ? 'sticky' : null}>
            <Link href="/listings/buy" as="/">
              <>
                {!search && <Logo alt="EmCasa Imobiliária no Rio de Janeiro e São Paulo" />}
                {search && <ShortLogo alt="EmCasa Imobiliária no Rio de Janeiro e São Paulo" />}
              </>
            </Link>
            {search && this.renderSearch()}
            {isMobileNavVisible && <Overlay onClick={this.toggleMobileNavVisibility} />}
            <NavButton
              visible={!isMobileNavVisible && !search}
              onClick={this.toggleMobileNavVisibility}
            >
              ☰
            </NavButton>
            <Nav visible={isMobileNavVisible}>
              <CloseNavButton
                visible={isMobileNavVisible}
                onClick={this.toggleMobileNavVisibility} />
              <Link href="/listings/search" as="/imoveis">
                <MenuItem className={router.route === '/listings/search' ? 'active' :  null}>
                  <FontAwesomeIcon icon={faSearch} className="icon" />
                  <Text>Comprar</Text>
                </MenuItem>
              </Link>
              <Link href="/vender">
                <MenuItem className={currentPath.startsWith('/vender') ? 'active' :  null}>
                  <FontAwesomeIcon className="icon" icon={faFlag} />
                  <Text>Vender</Text>
                </MenuItem>
              </Link>
              {authenticated && (
                <Link href="/meu-perfil">
                  <MenuItem className={currentPath.startsWith('/meu-perfil') ? 'active' :  null}>
                    <FontAwesomeIcon className="icon" icon={faUser} />
                    <Text>Meu Perfil</Text>
                  </MenuItem>
                </Link>
              )}
              {!authenticated && (<AccountKit
                appId={process.env.FACEBOOK_APP_ID}
                appSecret={process.env.ACCOUNT_KIT_APP_SECRET}
                version="v1.0"
              >
                {({signIn, loading}) => (
                  <MenuItem onClick={signIn}>
                    <FontAwesomeIcon className="icon" icon={faSignInAlt} />
                    <Text>Entrar</Text>
                  </MenuItem>
                )}
              </AccountKit>)}
            </Nav>
          </Container>
        </Wrapper>
      </ThemeProvider>
    )
  }
}
