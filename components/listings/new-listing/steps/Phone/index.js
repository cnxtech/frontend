import React, {Component} from 'react'
import {Formik, Field} from 'formik'
import * as Sentry from '@sentry/browser'
import {get} from 'lodash'
import AccountKit from 'components/shared/Auth/AccountKit'
import Input from '@emcasa/ui-dom/components/Input'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import NavButtons from 'components/listings/new-listing/shared/NavButtons'
import Container from 'components/listings/new-listing/shared/Container'
import {requestPricing} from 'components/listings/new-listing/lib/pricing'
import Steps from 'components/listings/new-listing/shared/Steps'
import {EDIT_PROFILE} from 'graphql/user/mutations'
import {
  log,
  getSellerEventPrefix,
  SELLER_ONBOARDING_PHONE_LOGIN_START,
  SELLER_ONBOARDING_PHONE_LOGIN_SUCCESS,
  SELLER_ONBOARDING_PHONE_LOGIN_CANCEL,
  SELLER_ONBOARDING_PHONE_UPDATE_USER_NAME
} from 'lib/logging'

class Phone extends Component {
  constructor(props) {
    super(props)
    this.previousStep = this.previousStep.bind(this)
    this.validateName = this.validateName.bind(this)
    this.validateLocalAreaCode = this.validateLocalAreaCode.bind(this)
    this.validateNumber = this.validateNumber.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)
    this.onLoginSuccess = this.onLoginSuccess.bind(this)
    this.estimatePrice = this.estimatePrice.bind(this)
    this.updateUserProfile = this.updateUserProfile.bind(this)

    this.dddField = React.createRef()
    this.phoneNumberField = React.createRef()
    this.nameField = React.createRef()
  }

  state = {
    name: null,
    localAreaCode: null,
    number: null,
    userInfo: null,
    loading: false,
    error: null
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
    if (this.nameField.current && !this.props.isMobile) {
      this.nameField.current.focus()
    }
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  updateStateFromProps(props) {
    const { phone } = props
    if (phone) {
      this.setState({
        localAreaCode: phone.localAreaCode,
        number: phone.number,
        name: phone.name
      })
    }
  }

  async updateUserProfile(id) {
    try {
      // Update user mutation
      if (!id) {
        id = this.props.user.id
      }
      const response = await apolloClient.mutate({
        mutation: EDIT_PROFILE,
        variables: {
          id: id,
          name: this.state.name
        }
      })

      // Handle result
      if (response && response.data) {
        const name = response.data.editUserProfile.name
        const phone = response.data.editUserProfile.phone
        log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_PHONE_UPDATE_USER_NAME}`, {
          name: name,
          phone: phone
        })
      }
    } catch (e) {
      Sentry.captureException(e)
      this.setState({
        loading: false,
        error: 'Ocorreu um erro. Por favor, tente novamente.'
      })
    }
  }

  async onLoginSuccess(userInfo) {
    if (!userInfo) {
      log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_PHONE_LOGIN_CANCEL}`)
      this.setState({loading: false})
      return
    }

    const { updatePhone } = this.props
    const id = get(userInfo, 'data.accountKitSignIn.user.id', null)
    const name = get(userInfo, 'data.accountKitSignIn.user.name') || this.state.name
    updatePhone({
      localAreaCode: this.state.localAreaCode,
      number: this.state.number,
      id,
      name
    })

    await this.updateUserProfile(id)

    log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_PHONE_LOGIN_SUCCESS}`, {
      id: id,
      name: name,
      localAreaCode: this.state.localAreaCode,
      number: this.state.number
    })
    this.estimatePrice({name})
  }

  estimatePrice = async (userInfo) => {
    const result = await requestPricing(apolloClient, userInfo, this.props)
    const error = result && result.error
    this.setState({
      loading: false,
      error: error ? result.error : null
    })
    if (error) {
      return
    }
    this.props.navigateTo('pricing')
  }

  previousStep() {
    const { navigateTo } = this.props
    navigateTo('bedrooms')
  }

  validateLocalAreaCode(value) {
    if (!value) {
      return "É necessário informar o DDD."
    }
  }

  validateNumber(value) {
    if (!value) {
      return "É necessário informar o número do telefone."
    }
  }

  validateName(value) {
    if (!value || !value.trim()) {
      return "Informe seu nome."
    }
  }

  render() {
    const { phone } = this.props
    let localAreaCode, number, name
    if (phone) {
      name = phone.name
      localAreaCode = phone.localAreaCode
      number = phone.number
    }
    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              initialValues={{
                name: name,
                localAreaCode: localAreaCode,
                number: number
              }}
              isInitialValid={() => {
                const localValid = this.validateLocalAreaCode(localAreaCode)
                const numberValid = this.validateNumber(number)
                const nameValid = this.validateName(name)
                return !(localValid || numberValid || nameValid)
              }}
              render={({isValid, setFieldTouched, setFieldValue, errors}) => (
                <>
                  <Steps currentStep="contact" />
                  <Text
                    fontSize="large"
                    fontWeight="bold"
                    textAlign="center">
                    Qual o número do seu celular?
                  </Text>
                  <Text color="grey">
                    {this.props.evaluation ? "Deixe seu contato para visualizar a avaliação." : "Vamos precisar confirmar algumas informações do seu imóvel."}
                  </Text>
                  <Row>
                    <Col width={1} mr={4}>
                      <Field
                        name="name"
                        validate={this.validateName}
                        render={({form}) => (
                          <Input
                            hideLabelView
                            ref={this.nameField}
                            placeholder="Nome*"
                            error={form.touched.name ? errors.name : null}
                            defaultValue={name}
                            onChange={(e) => {
                              const { value } = e.target
                              setFieldValue('name', value)
                              setFieldTouched('name')
                              this.setState({name: value})
                            }}
                          />
                        )}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col width={3/12} mr={5}>
                      <Field
                        name="localAreaCode"
                        validate={this.validateLocalAreaCode}
                        render={({form}) => (
                          <Input
                            hideLabelView
                            hideErrorView
                            type="tel"
                            ref={this.dddField}
                            placeholder="DDD*"
                            defaultValue={localAreaCode}
                            onChange={(e) => {
                              const { value } = e.target
                              setFieldValue('localAreaCode', value)
                              setFieldTouched('localAreaCode')
                              this.setState({localAreaCode: value})
                              if (value.length === 2) {
                                this.phoneNumberField.current.focus()
                              }
                            }}
                          />
                        )}/>
                    </Col>
                    <Col width={6/12}>
                      <Field
                        name="number"
                        validate={this.validateNumber}
                        render={({form}) => (
                          <Input
                            hideLabelView
                            hideErrorView
                            type="tel"
                            ref={this.phoneNumberField}
                            placeholder="Celular*"
                            defaultValue={number}
                            maxLength={9}
                            onChange={(e) => {
                              const { value } = e.target
                              setFieldValue('number', value)
                              setFieldTouched('number')
                              this.setState({number: value})
                            }}
                          />
                        )}/>
                    </Col>
                  </Row>
                  <Text color="red">{this.state.error}</Text>
                  <AccountKit
                    appId={process.env.FACEBOOK_APP_ID}
                    appSecret={process.env.ACCOUNT_KIT_APP_SECRET}
                    phoneNumber={this.state.localAreaCode + this.state.number}
                    version="v1.0"
                    onSuccess={this.onLoginSuccess}
                  >
                    {({signIn}) => (
                      <NavButtons
                        previousStep={this.previousStep}
                        onSubmit={() => {
                          const { user } = this.props
                          if (user && user.authenticated) {
                            this.setState({loading: true}, () => {
                              this.updateUserProfile()
                            })
                          } else {
                            log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_PHONE_LOGIN_START}`, {
                              name: this.state.name,
                              phone: `${this.state.localAreaCode}${this.state.number}`
                            })
                            this.setState({loading: true}, () => {
                              signIn()
                            })
                          }
                        }}
                        loading={this.state.loading}
                        submitEnabled={isValid}
                      />
                    )}
                  </AccountKit>
                </>
              )}
            />
          </Col>
        </Container>
      </div>
    )
  }
}

export default withBreakpoint()(Phone)
