import React from 'react'
import {Provider} from 'react-redux'
import * as Sentry from '@sentry/browser'
import get from 'lodash/get'
import withRedux from 'next-redux-wrapper'
import App, {Container} from 'next/app'
import isUndefined from 'lodash/isUndefined'
import Layout from 'components/shared/Shell'
import {isAuthenticated, isAdmin, getCurrentUserId} from 'lib/auth'
import withApolloClient from 'lib/apollo/withApolloClient'
import {ApolloProvider} from 'react-apollo'
import {getJwt} from 'lib/auth'
import {getCookie, removeCookie, setCookie} from 'lib/session'
import makeStore from 'redux/store'
import {ThemeProvider} from 'styled-components'
import theme from 'config/theme'
import '@emcasa/ui-dom/components/global-styles'
import {DEVICE_ID_COOKIE} from 'components/shared/Flagr'
import uuid from 'utils/uuid'
import HTTPMessage from 'components/shared/Shell/HTTPMessage'
import GlobalStyles from 'styles/global'
import {
  ALLOW_URLS,
  IGNORE_URLS,
  IGNORE_ERRORS
} from 'lib/sentry'

class MyApp extends App {
  static async getInitialProps(ctx) {
    const SENTRY_DSN = process.env.SENTRY_DSN
    const {Component, router, ctx: context} = ctx
    global.res = context.res
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(context)
    }

    const authenticated = isAuthenticated(context)

    return {
      SENTRY_DSN,
      pageProps,
      url: {
        query: router.query,
        pathname: router.pathname,
        asPath: router.asPath
      },
      authenticated,
      currentUser: {
        id: getCurrentUserId(context),
        authenticated,
        admin: isAdmin(context),
        jwt: getJwt(context)
      },
      isAdmin: isAdmin(context)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      currentUser: null
    }
  }

  componentDidMount() {
    Sentry.init({
      release: process.env.SENTRY_RELEASE,
      dsn: this.props.SENTRY_DSN,
      whitelistUrls: ALLOW_URLS,
      blacklistUrls: IGNORE_URLS,
      ignoreErrors: IGNORE_ERRORS
    })
    if (getCookie('resetAuth')) {
      removeCookie('jwt')
      removeCookie('currentUserId')
      removeCookie('userRole')
      removeCookie('resetAuth')
    }

    if (process.browser) {
      window.addEventListener('onLogin', this.updateSession)
    }

    // Set deviceId for Flagr
    const deviceId = uuid()
    if (!getCookie(DEVICE_ID_COOKIE) && deviceId) {
      setCookie(DEVICE_ID_COOKIE, deviceId)
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      window.removeEventListener('onLogin', this.updateSession)
    }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      if (errorInfo) {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key])
        })
      }
      Sentry.captureException(error)
    })
  }

  updateSession = (event) => {
    const { userInfo } = event.detail
    const isAdmin = get(userInfo, 'data.accountKitSignIn.user.role', '') === 'admin'
    const jwt = get(userInfo, 'data.accountKitSignIn.jwt', '')
    const id = get(userInfo, 'data.accountKitSignIn.user.id', '')
    this.setState({
      currentUser: {
        authenticated: true,
        jwt,
        id,
        isAdmin
      }
    })
  }

  render() {
    let {
      Component,
      pageProps,
      url,
      router,
      authenticated,
      isAdmin,
      apolloClient,
      currentUser,
      error,
      store
    } = this.props

    if (this.state.currentUser) {
      currentUser = this.state.currentUser
      authenticated = this.state.currentUser.authenticated
      isAdmin = this.state.currentUser.isAdmin
      pageProps.currentUser = currentUser
    }

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <ApolloProvider client={apolloClient}>
            <Provider store={store}>
              <Layout
                authenticated={authenticated}
                isAdmin={isAdmin}
                renderFooter={
                  isUndefined(pageProps.renderFooter) ? true : false
                }
                pageProps={pageProps}
                router={router}
              >
                <GlobalStyles/>
                {error ? (
                  <HTTPMessage asPath={url.asPath} statusCode={error.code} />
                ) : (
                  <Component
                    {...pageProps}
                    url={url}
                    router={router}
                    user={currentUser}
                    client={apolloClient}
                  />
                )}
              </Layout>
            </Provider>
          </ApolloProvider>
        </Container>
      </ThemeProvider>
    )
  }
}

export default withApolloClient(withRedux(makeStore)(MyApp))
