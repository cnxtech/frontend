import React, {Component} from 'react'
import * as Sentry from '@sentry/browser'
import {Formik, Field} from 'formik'
import Button from '@emcasa/ui-dom/components/Button'
import Input from '@emcasa/ui-dom/components/Input'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Container from 'components/listings/new-listing/shared/Container'
import Text from '@emcasa/ui-dom/components/Text'
import NavButtons from 'components/listings/new-listing/shared/NavButtons'
import {getUser} from 'components/listings/new-listing/lib/auth'
import Steps from 'components/listings/new-listing/shared/Steps'
import {requestPricing} from 'components/listings/new-listing/lib/pricing'

class Bedrooms extends Component {
  constructor(props) {
    super(props)
    this.previousStep = this.previousStep.bind(this)
    this.validateBedroom = this.validateBedroom.bind(this)
    this.validateSuite = this.validateSuite.bind(this)
    this.validateBathroom = this.validateBathroom.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)
    this.validateSpots = this.validateSpots.bind(this)

    this.checkUserInfo = this.checkUserInfo.bind(this)
    this.estimatePrice = this.estimatePrice.bind(this)
    this.submit = this.submit.bind(this)
  }

  state = {
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    spots: null,
    enterMoreBedrooms: false,
    enterMoreBathrooms: false,
    showSuites: false,
    showBathrooms: false,
    showSpots: false,
    loading: false,
    error: null
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  updateStateFromProps(props) {
    const { rooms } = props
    if (rooms) {
      this.setState(rooms)
    }
  }

  async checkUserInfo() {
    const { updateRooms, user } = this.props
    updateRooms({
      bedrooms: this.state.bedrooms,
      suites: this.state.suites,
      bathrooms: this.state.bathrooms,
      spots: this.state.spots,
      enterMoreBedrooms: this.state.enterMoreBedrooms,
      enterMoreBathrooms: this.state.enterMoreBathrooms,
      showSuites: this.state.showSuites,
      showBathrooms: this.state.showBathrooms,
      showSpots: this.state.showSpots,
    })
    const authenticated = user && user.authenticated

    // Check user info
    if (authenticated) {
      const { updatePhone } = this.props
      try {
        const userInfo = await getUser(user.id, updatePhone)
        // Get pricing if user has both name and phone
        if (userInfo && userInfo.name && userInfo.phone) {
          await this.estimatePrice(userInfo)
          return
        }
      } catch (e) {
        Sentry.captureException(new Error(e))
        this.setState({
          loading: false,
          error: 'Ocorreu um erro. Por favor, tente novamente.'
        })
        return
      }
    }
    this.props.navigateTo('phone')
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

  submit() {
    this.setState({loading: true})
    this.checkUserInfo()
  }

  previousStep() {
    const { navigateTo } = this.props
    navigateTo('homeDetails')
  }

  validateBedroom(value) {
    if (!value) {
      return 'É necessário informar o número de quartos.'
    }
    if (value < 0) {
      return 'Insira um valor positivo.'
    }
  }

  validateSuite(value) {
    if (typeof value !== 'number') {
      return 'É necessário informar o número de suítes.'
    }
    if (value < 0) {
      return 'Insira um valor positivo.'
    }
  }

  validateBathroom(value) {
    if (typeof value !== 'number') {
      return 'É necessário informar o número de banheiros.'
    }
    if (value < 0) {
      return 'Insira um valor positivo.'
    }
  }

  validateSpots(spots) {
    if (typeof spots !== 'number') {
      return "É necessário informar o número de vagas"
    }
  }

  bedroomSelection(setFieldTouched, setFieldValue, error, touched) {
    const { rooms } = this.props
    let bedrooms
    if (rooms) bedrooms = rooms.bedrooms
    if (this.state.enterMoreBedrooms) {
      return (
        <Col width={3/4}>
          <Input fluid hideLabelView placeholder="Número de quartos" type="number" error={touched ? error : null} onChange={(e) => {
            const { value } = e.target
            const intValue = parseInt(value)
            setFieldValue('bedroom', intValue)
            setFieldTouched('bedroom')
            this.setState({bedrooms: intValue, showSuites: true})
          }} defaultValue={bedrooms} />
        </Col>
      )
    }
    return (
      <Button.Group flexWrap="wrap" initialValue={bedrooms} onChange={(value) => {
          if (value === 'more') {
            this.setState({enterMoreBedrooms: true})
          } else {
            const intValue = parseInt(value)
            setFieldValue('bedroom', intValue)
            setFieldTouched('bedroom')
            this.setState({bedrooms: intValue, showSuites: true}, () => {
              window.scrollTo(0, document.body.scrollHeight)
            })
          }
        }}>
        <Button name="1" px={3} mr={2} value={1} height="tall">1</Button>
        <Button name="2" px={3} mr={2} value={2} height="tall">2</Button>
        <Button name="3" px={3} mr={2} value={3} height="tall">3</Button>
        <Button name="4" px={3} mr={2} value={4} height="tall">4</Button>
        <Button name="5" px={3} mr={2} value={5} height="tall">5</Button>
        <Button name="more" px={3} mr={2} value="more" height="tall">+</Button>
      </Button.Group>
    )
  }

  bathroomSelection(setFieldTouched, setFieldValue, error, touched) {
    const { rooms } = this.props
    let bathrooms
    if (rooms) bathrooms = rooms.bathrooms
    if (this.state.enterMoreBathrooms) {
      return (
        <Col width={3/4}>
          <Input fluid hideLabelView placeholder="Número de banheiros" type="number" error={touched ? error : null} onChange={(e) => {
            const { value } = e.target
            const intValue = parseInt(value)
            setFieldValue('bathroom', intValue)
            setFieldTouched('bathroom')
            this.setState({showSpots: true, bathrooms: intValue})
          }} defaultValue={bathrooms} />
        </Col>
      )
    }
    return (
      <Button.Group flexWrap="wrap" initialValue={bathrooms} onChange={(value) => {
          if (value === 'more') {
            this.setState({enterMoreBathrooms: true})
          } else {
            const intValue = parseInt(value)
            setFieldValue('bathroom', intValue)
            setFieldTouched('bathroom')
            this.setState({showSpots: true, bathrooms: intValue}, () => {
              window.scrollTo(0, document.body.scrollHeight)
            })
          }
        }}>
        <Button mr={2} px={2} value={0} height="tall">Nenhum</Button>
        <Button mr={2} px={2} value={1} height="tall">1</Button>
        <Button mr={2} px={3} value={2} height="tall">2</Button>
        <Button mr={2} px={3} value={3} height="tall">3</Button>
        <Button mr={2} px={3} value={4} height="tall">4</Button>
        <Button mr={2} px={3} value={5} height="tall">5</Button>
        <Button mr={2} px={3} value="more" height="tall">+</Button>
      </Button.Group>
    )
  }

  render() {
    const { rooms } = this.props
    let bedrooms, bathrooms, suites, spots
    if (rooms) {
      bedrooms = rooms.bedrooms
      bathrooms = rooms.bathrooms
      suites = rooms.suites
      spots = rooms.spots
    }
    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              initialValues={{
                bedroom: bedrooms,
                suite: suites,
                bathroom: bathrooms,
                spots: spots
              }}
              isInitialValid={() => {
                return !(
                  this.validateBedroom(bedrooms) ||
                  this.validateSuite(suites) ||
                  this.validateBathroom(bathrooms) ||
                  this.validateSpots(spots)
                )
              }}
              render={({isValid, setFieldTouched, setFieldValue, errors}) => (
                <>
                  <Steps currentStep="info" />
                  <Text
                    fontSize="large"
                    fontWeight="bold"
                    textAlign="center">
                    Por favor, informe mais detalhes do seu imóvel
                  </Text>
                  <Text textAlign="center" color="grey">Quantos quartos tem no seu imóvel?</Text>
                  <Row mb={4} flexWrap="wrap" justifyContent="center">
                    <Field
                      name="bedroom"
                      validate={this.validateBedroom}
                      render={({form}) => this.bedroomSelection(setFieldTouched, setFieldValue, errors.bedroom, form.touched.bedroom)} />
                  </Row>
                  {this.state.showSuites && <> <Text textAlign="center" color="grey">Algum deles é suíte? Quantos?</Text>
                    <Row mb={4} flexWrap="wrap" justifyContent="center">
                      <Field
                        name="suite"
                        validate={this.validateSuite}
                        render={() =>
                          <Button.Group flexWrap="wrap" initialValue={suites} onChange={(value) => {
                            setFieldValue('suite', value)
                            setFieldTouched('suite')
                            this.setState({suites: value, showBathrooms: true}, () => {
                              window.scrollTo(0, document.body.scrollHeight)
                            })
                            }}>
                            <Button mr={2} px={3} value={0} height="tall">Sem suíte</Button>
                            <Button mr={2} px={3} value={1} height="tall">1</Button>
                            <Button mr={2} px={3} value={2} height="tall">2</Button>
                            <Button mr={2} px={3} value={3} height="tall">3</Button>
                            <Button mr={2} px={3} value={4} height="tall">4</Button>
                          </Button.Group>
                        }/>
                    </Row>
                  </>}
                  {this.state.showBathrooms && <>
                    <Text textAlign="center" color="grey">Sem contar lavabos e suítes, ele tem quantos banheiros?</Text>
                    <Row mb={4} justifyContent="center">
                      <Field
                        name="bathroom"
                        validate={this.validateBathroom}
                        render={({form}) => this.bathroomSelection(setFieldTouched, setFieldValue, errors.bathroom, form.touched.bathroom)} />
                    </Row>
                  </>}
                  {this.state.showSpots && <>
                    <Text textAlign="center" color="grey">Possui vagas de garagem?</Text>
                    <Row mb={4} justifyContent="center">
                      <Field
                        name="spots"
                        validate={this.validateSpots}
                        render={() =>
                          <Button.Group flexWrap="wrap" initialValue={spots} onChange={(value) => {
                            setFieldValue('spots', value)
                            setFieldTouched('spots')
                            this.setState({spots: value}, () => {
                              window.scrollTo(0, document.body.scrollHeight)
                            })
                            }}>
                            <Button mr={2} px={3} value={0} height="tall">Não tem</Button>
                            <Button mr={2} px={3} value={1} height="tall">1</Button>
                            <Button mr={2} px={3} value={2} height="tall">2</Button>
                            <Button mr={2} px={3} value={3} height="tall">3</Button>
                            <Button mr={2} px={3} value={4} height="tall">4</Button>
                          </Button.Group>
                      }/>
                    </Row>
                  </>}
                  <Text color="red">{this.state.error}</Text>
                  <NavButtons
                    previousStep={this.previousStep}
                    onSubmit={this.submit}
                    loading={this.state.loading}
                    submitEnabled={isValid && !this.state.loading}
                  />
                </>
              )}
            />
          </Col>
        </Container>
      </div>
    )
  }
}

export default Bedrooms
