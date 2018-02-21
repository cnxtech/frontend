import {Component, Fragment} from 'react'
import Link from 'next/link'

import Container from './styled'

export default class Header extends Component {
  state = {
    isMobileNavVisible: false
  }

  toggleMobileNavVisibility = () => {
    const newState = !this.state.isMobileNavVisible
    this.setState({isMobileNavVisible: newState})
  }

  renderNav() {
    const {authenticated, errorCode} = this.props
    const {isMobileNavVisible} = this.state

    return (
      <Fragment>
        <button onClick={this.toggleMobileNavVisibility}>☰</button>

        <div className={isMobileNavVisible ? 'visible' : ''}>
          {authenticated && (
            <Link href="/listings/new" as="/imoveis/adicionar">
              <a>Adicionar Imóvel</a>
            </Link>
          )}

          <Link href="/indique">
            <a>Indique e Ganhe</a>
          </Link>

          <Link href="/jobs">
            <a>Trabalhe Conosco</a>
          </Link>

          {authenticated && (
            <Link href="/auth/logout">
              <a>Logout</a>
            </Link>
          )}
        </div>
      </Fragment>
    )
  }

  render() {
    const {authenticated, errorCode} = this.props

    return (
      <Container>
        <Link href="/">
          <a>
            <img
              src="/static/emcasa-imobiliaria-rio-de-janeiro.png"
              alt="Emcasa Imobiliária no Rio de Janeiro"
            />
          </a>
        </Link>
        {errorCode ? <div>errorCode</div> : this.renderNav()}
      </Container>
    )
  }
}
