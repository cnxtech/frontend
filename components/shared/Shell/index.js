import {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Footer from './Footer'
import Header from './Header'
import {Main} from './styles'

Router.onRouteChangeStart = () => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => NProgress.done()

class Layout extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      authenticated,
      isAdmin,
      errorCode,
      renderFooter,
      pageProps,
      router
    } = this.props

    const FooterComponent = Footer
    const HeaderComponent = Header
    return (
      <Fragment>
        <Head />
        <HeaderComponent
          errorCode={errorCode}
          authenticated={authenticated}
          isAdmin={isAdmin}
          notifications={this.notifications}
          router={router}
          pageProps={pageProps}
          search={pageProps.headerSearch}
          transparent={pageProps.transparentHeader}
        />
        <Main
          transparentHeader={pageProps.transparentHeader}
          search={pageProps.headerSearch}
        >
          {this.props.children}
        </Main>
        {renderFooter && <FooterComponent />}
      </Fragment>
    )
  }
}

export default withRouter(Layout)
