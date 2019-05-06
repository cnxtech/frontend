import {Component} from 'react'
import PropTypes from 'prop-types'
import {Mutation} from 'react-apollo'
import {SIGN_IN_ACCOUNT_KIT} from 'graphql/user/mutations'
import {signUpUser} from 'lib/auth'
import {
  log,
  LOGIN_SUCCESS,
  LOGIN_ERROR
} from 'lib/logging'
import {zIndexModal} from 'constants/zIndex'

class AccountKit extends Component {
  state = {
    canSignIn: false,
    signingIn: false,
    loading: false
  }

  setAccountKit = () => (window.AccountKit_OnInteractive = this.onLoad)

  componentDidMount() {
    const {autoLogin} = this.props
    if (!window.AccountKit) {
      const {language} = this.props
      const tag = document.createElement('script')
      tag.setAttribute('src', `https://sdk.accountkit.com/${language}/sdk.js`)
      tag.setAttribute('id', 'account-kit')
      tag.setAttribute('type', 'text/javascript')
      tag.onload = this.setAccountKit
      document.head.appendChild(tag)
    } else {
      if (autoLogin) {
        this.signIn()
      }
    }
  }

  onLoad = () => {
    const {appId, csrf, version, autoLogin} = this.props
    const accountKitProps = {
      appId,
      state: csrf,
      version,
      fbAppEventsEnabled: true,
      display: 'modal',
      debug: process.env.NODE_ENV !== 'production'
    }
    window.AccountKit.init(accountKitProps)
    if (autoLogin) {
      this.signIn()
    }
  }

  signIn = () => {
    const {loginType, countryCode, phoneNumber, emailAddress, onSuccess} = this.props

    const options = {}
    if (countryCode) {
      options.countryCode = countryCode
    }

    if (loginType === 'PHONE' && phoneNumber) {
      options.phoneNumber = phoneNumber
    } else if (loginType === 'EMAIL' && emailAddress) {
      options.emailAddress = emailAddress
    }

    window.AccountKit.login(loginType, options, async (resp) => {
      const userInfo = await this.onSuccess(resp)
      if (onSuccess) {
        onSuccess(userInfo)
      }
    })

    const divs = document.getElementsByTagName('div')
    divs[divs.length - 1].style.zIndex = zIndexModal - 1
  }

  onSuccess = async (resp) => {
    const {code} = resp
    const {appId, appSecret} = this.props

    if (resp.status === 'PARTIALLY_AUTHENTICATED' && code) {
      this.setState({loading: true})
      const data = await fetch(
        `https://graph.accountkit.com/v1.0/access_token?grant_type=authorization_code&code=${code}&
        access_token=AA%7C${appId}%7C${appSecret}`
      )

      const signInInfo = await data.json()

      const userInfo = await this.serverSignIn({
        variables: {
          accessToken: signInInfo.access_token
        }
      })

      const user = {
        jwt: userInfo.data.accountKitSignIn.jwt,
        id: parseInt(userInfo.data.accountKitSignIn.user.id),
        role: userInfo.data.accountKitSignIn.user.role
      }

      signUpUser(user)
      dispatchEvent(new CustomEvent('onLogin', {
        detail: {userInfo}
      }))

      log(LOGIN_SUCCESS)
      this.setState({loading: false})
      return userInfo
    } else if (resp.status === 'NOT_AUTHENTICATED') {
      log(LOGIN_ERROR, resp)
    } else if (resp.status === 'BAD_PARAMS') {
      log(LOGIN_ERROR, resp)
    }
  }

  render() {
    const {signIn} = this
    const {children} = this.props
    const {loading} = this.state
    return (
      <>
        <Mutation mutation={SIGN_IN_ACCOUNT_KIT}>
          {(serverSignIn, {data, loading: signingIn}) => {
            this.serverSignIn = serverSignIn
            return children({
              signIn,
              loading: signingIn || loading,
              userInfo: data ? data.accountKitSignIn : null
            })
          }}
        </Mutation>
      </>
    )
  }
}

AccountKit.propTypes = {
  csrf: PropTypes.string.isRequired,
  appId: PropTypes.string,
  appSecret: PropTypes.string,
  version: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  loginType: PropTypes.oneOf(['PHONE', 'EMAIL']),
  language: PropTypes.string,
  countryCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  emailAddress: PropTypes.string,
  autoLogin: PropTypes.bool
}

AccountKit.defaultProps = {
  language: 'pt_BR',
  loginType: 'PHONE',
  countryCode: '+55',
  phoneNumber: '',
  csrf: 'RANDOMCSRF'
}

export default AccountKit
