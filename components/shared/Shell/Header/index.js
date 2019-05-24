import Link from 'next/link'
import {Component} from 'react'
import theme from '@emcasa/ui'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import AccountKit from 'components/shared/Auth/AccountKit'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-pro-solid/faSearch'
import faFlag from '@fortawesome/fontawesome-pro-solid/faFlag'
import faUser from '@fortawesome/fontawesome-pro-solid/faUser'
import faSignInAlt from '@fortawesome/fontawesome-pro-solid/faSignInAlt'
import NeighborhoodPicker from 'components/shared/NeighborhoodPicker'
import {MobileTypeaheadContainer} from 'components/shared/NeighborhoodAutoComplete/styles'
import {log, LANDING_LOGIN} from 'lib/logging'
import Container, {
  Nav,
  Overlay,
  NavButton,
  MenuItem,
  LogoWrapper,
  LabelLogo,
  SearchWrapper
} from './styles'
import Logo from 'components/shared/Logo'
import CloseButton from 'components/shared/Common/Buttons/CloseButton'

const HEADER_STICKY_THRESHOLD = 60

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sticky: false,
      isMobileNavVisible: false,
      showFullScreenSearch: false
    }
  }

  onScroll = () => {
    this.setState({sticky: window.scrollY > HEADER_STICKY_THRESHOLD})
  }

  openMobileSearch = () => {
    this.setState({
      showFullScreenSearch: true
    })
  }

  closeMobileSearch = () => {
    this.setState({
      showFullScreenSearch: false
    })
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
    const {isMobile, pageProps} = this.props
    let neighborhood = []
    if (pageProps.params && pageProps.params.filters) {
      neighborhood = pageProps.params.filters.neighborhoods
    }
    return (
      <NeighborhoodPicker
        onClick={isMobile ? this.openMobileSearch : () => {}}
        neighborhood={neighborhood}
      />
    )
  }

  renderFullScreenSearch() {
    const {pageProps} = this.props
    let neighborhood = []
    if (pageProps.params && pageProps.params.filters) {
      neighborhood = pageProps.params.filters.neighborhoods
    }
    return (
      <MobileTypeaheadContainer justifyContent="center" p={4}>
        <Col width={1}>
          <NeighborhoodPicker
            mobile
            fullscreen
            neighborhood={neighborhood}
            onBackPressed={this.closeMobileSearch}
          />
        </Col>
      </MobileTypeaheadContainer>
    )
  }

  render() {
    const {authenticated, router, pageProps} = this.props
    const search = pageProps.headerSearch
    const transparent = pageProps.transparentHeader
    const {sticky, isMobileNavVisible} = this.state
    const currentPath = router.asPath

    return (
      <Container
        transparent={transparent}
        sticky={sticky && !search}
        search={search}
      >
        <Row alignItems="center" width={[1, null, null, 1 / 2]}>
          <LogoWrapper hideText={search}>
            <Link passHref href="/listings/buy" as="/">
              <a>
                <Logo
                  hideText={search}
                  logoFill={theme.colors.pink}
                  textFill={theme.colors.dark}
                />
                <LabelLogo>
                  EmCasa Imobiliária no Rio de Janeiro e São Paulo
                </LabelLogo>
              </a>
            </Link>
          </LogoWrapper>
          <Overlay
            visible={isMobileNavVisible}
            onClick={this.toggleMobileNavVisibility}
          />
          <NavButton
            visible={!isMobileNavVisible && !search}
            onClick={this.toggleMobileNavVisibility}
          >
            ☰
          </NavButton>
        </Row>
        <Col width={[0, null, null, 1 / 2]}>
          <Nav visible={isMobileNavVisible}>
            <CloseButton aria-label="Fechar menu" onClick={this.toggleMobileNavVisibility} />
            <Link passHref href="/listings" as="/imoveis">
              <MenuItem
                className={router.route === '/listings' ? 'active' : null}
                onClick={this.toggleMobileNavVisibility}
              >
                <FontAwesomeIcon icon={faSearch} className="icon" />
                Comprar
              </MenuItem>
            </Link>
            <Link passHref href="/vender">
              <MenuItem
                className={currentPath.startsWith('/vender') ? 'active' : null}
                onClick={this.toggleMobileNavVisibility}
              >
                <FontAwesomeIcon className="icon" icon={faFlag} />
                Vender
              </MenuItem>
            </Link>
            {authenticated && (
              <Link passHref href="/meu-perfil">
                <MenuItem
                  className={
                    currentPath.startsWith('/meu-perfil') ? 'active' : null
                  }
                  onClick={this.toggleMobileNavVisibility}
                >
                  <FontAwesomeIcon className="icon" icon={faUser} />
                  Meu Perfil
                </MenuItem>
              </Link>
            )}
            {!authenticated && (
              <AccountKit
                appId={process.env.FACEBOOK_APP_ID}
                appSecret={process.env.ACCOUNT_KIT_APP_SECRET}
                version="v1.0"
              >
                {({signIn, loading}) => (
                  <MenuItem
                    aria-label="Fazer login"
                    onClick={() => {
                      log(LANDING_LOGIN)
                      signIn()
                    }}
                  >
                    <FontAwesomeIcon className="icon" icon={faSignInAlt} />
                    Entrar
                  </MenuItem>
                )}
              </AccountKit>
            )}
          </Nav>
        </Col>
      </Container>
    )
  }
}

export default withBreakpoint()(Header)
