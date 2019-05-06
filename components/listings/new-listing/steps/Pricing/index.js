import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field } from 'formik'
import MaskedInput from 'react-text-mask'
import Icon from '@emcasa/ui-dom/components/Icon'
import Input from '@emcasa/ui-dom/components/Input'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import NavButtons from 'components/listings/new-listing/shared/NavButtons'
import Container from 'components/listings/new-listing/shared/Container'
import Steps from 'components/listings/new-listing/shared/Steps'
import {
  currencyInputMask,
  currencyToInt,
  intToCurrency,
  roundUpPrice
} from 'utils/text-utils'
import Ticket from 'components/listings/new-listing/shared/Ticket'
import LoadingText from './LoadingText'
import {
  log,
  getSellerEventPrefix,
  SELLER_ONBOARDING_EDIT_PRICE,
  SELLER_ONBOARDING_EDIT_PRICE_CANCEL,
  SELLER_ONBOARDING_EDIT_PRICE_CONFIRM,
  SELLER_EVALUATION_SUCCESS
} from 'lib/logging'

const LOADING_TIME = 9000
const MIN_ALLOWED_PRICE = 250000

class Pricing extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)
    this.validateUserPrice = this.validateUserPrice.bind(this)
    this.noPriceSuggestion = this.noPriceSuggestion.bind(this)
    this.getListingSummary = this.getListingSummary.bind(this)
    this.showPrice = this.showPrice.bind(this)

    this.userPriceInput = null
    this.loadingTimeout = null
  }

  state = {
    userPrice: null,
    suggestedPrice: null,
    editingPrice: false,
    showPrice: false
  }

  componentDidMount() {
    this.updateStateFromProps(this.props)
    if (this.userPriceInput && !this.props.isMobile) {
      this.userPriceInput.focus()
    }
    this.loadingTimeout = setTimeout(this.showPrice, LOADING_TIME)
  }

  componentWillUnmount() {
    clearTimeout(this.loadingTimeout)
  }

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props)
  }

  showPrice() {
    this.setState({ showPrice: true })
  }

  updateStateFromProps(props) {
    const { pricing } = props
    if (pricing) {
      this.setState({
        userPrice: pricing.userPrice,
        suggestedPrice: pricing.suggestedPrice,
        editingPrice: pricing.editingPrice || !pricing.suggestedPrice
      })
    }
  }

  nextStep() {
    const intUserPrice = this.state.userPrice ? parseInt(this.state.userPrice) : roundUpPrice(this.state.suggestedPrice)
    const intSuggestedPrice = parseInt(this.state.suggestedPrice)
    if (this.state.suggestedPrice && this.state.editingPrice) {
      log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_EDIT_PRICE_CONFIRM}`, {
        suggestedPrice: roundUpPrice(intSuggestedPrice),
        userPrice: intUserPrice,
        difference: (intUserPrice - roundUpPrice(intSuggestedPrice))
      })
      this.setState({editingPrice: false})
      return
    }
    const { navigateTo, updatePricing, pricing } = this.props
    const newPricing = {
      priceRequestId: pricing.priceRequestId,
      userPrice: intUserPrice,
      suggestedPrice: intSuggestedPrice,
      editingPrice: this.state.editingPrice
    }
    if (this.props.evaluation) {
      log(SELLER_EVALUATION_SUCCESS)
    }
    updatePricing(newPricing)
    navigateTo('services')
  }

  previousStep() {
    if (this.state.suggestedPrice && this.state.editingPrice) {
      log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_EDIT_PRICE_CANCEL}`)
      this.setState({
        editingPrice: false,
        userPrice: this.props.pricing.userPrice
      })
      return
    }

    const { navigateTo } = this.props
    navigateTo('bedrooms')
  }

  currencyInput(errors, setFieldValue, setFieldTouched) {
    const { suggestedPrice } = this.props.pricing
    let defaultValue = null
    if (suggestedPrice) {
      defaultValue = roundUpPrice(suggestedPrice)
    }
    if (this.state.userPrice) {
      defaultValue = this.state.userPrice
    }
    return (
      <Col mr={4}>
        <Field
          name="userPrice"
          validate={this.validateUserPrice}
          render={({form}) =>
            <MaskedInput
              mask={currencyInputMask}
              render={(ref, props) =>
                <Input
                  {...props}
                  type="number"
                  hideLabelView
                  error={form.touched.userPrice ? errors.userPrice : null}
                  placeholder="R$ 000.000"
                  defaultValue={defaultValue}
                  type="tel"
                  ref={(input) => {
                    ref(input)
                    this.userPriceInput = input
                  }}
                  onChange={(e) => {
                    const value = currencyToInt(e.target.value)
                    setFieldValue('userPrice', value)
                    setFieldTouched('userPrice')
                    this.setState({userPrice: value})
                  }}
                />
              }
            />
          }
        />
      </Col>
    )
  }

  noPriceSuggestion(errors, setFieldValue, setFieldTouched) {
    return (
      <>
        <Row>
          <Col>
            <Text textAlign="center" color="grey">Não conseguimos concluir sua avaliação. Nesse caso, nossos especialistas irão enviar uma avaliação para você. Fique a vontade para preencher com o valor você gostaria de vender seu imóvel.</Text>
          </Col>
        </Row>
        <Row justifyContent="center">
          <Col width={[1,null,null,1/2]}>
            {this.currencyInput(errors, setFieldValue, setFieldTouched)}
          </Col>
        </Row>
      </>
    )
  }

  plural(item) {
    return item > 1 ? 's' : ''
  }

  getListingSummary() {
    const { homeDetails, rooms } = this.props
    let listingSummary = ''
    if (homeDetails && rooms) {
      const { area } = homeDetails
      const { bedrooms, suites, bathrooms, spots } = rooms
      listingSummary = `
        ${area}m² -
        ${bedrooms} Quarto${this.plural(bedrooms)}
        ${suites ? ` - ${suites} Suíte${this.plural(suites)}` : ``} -
        ${bathrooms} Banheiro${this.plural(bathrooms)}
        ${spots ? ` - ${spots} Vaga${this.plural(spots)}` : ``}
      `
    }

    return listingSummary
  }

  validateUserPrice(value) {
    if (!this.state.editingPrice) {
      return
    }
    if (!value) {
      return 'É necessário informar um preço de venda.'
    }
    if (value < MIN_ALLOWED_PRICE) {
      return 'O preço mínimo permitido é R$ 250.000.'
    }
  }

  getNextButtonLabel(showEditingPriceLabels) {
    if (showEditingPriceLabels) {
      return 'OK'
    }
    if (this.props.evaluation) {
      return 'Quero vender'
    } else {
      return 'Avançar'
    }
  }

  getPreviousButtonLabel(showEditingPriceLabels) {
    if (showEditingPriceLabels) {
      return 'Cancelar'
    }
    return 'Voltar'
  }

  render() {
    const { pricing, location } = this.props
    let suggestedPrice, userPrice
    if (pricing && location) {
      suggestedPrice = pricing.suggestedPrice ? roundUpPrice(pricing.suggestedPrice) : null
      userPrice = pricing.userPrice
    }
    const showEditingPriceLabels = this.state.suggestedPrice && this.state.editingPrice
    const nextButtonLabel = this.getNextButtonLabel(showEditingPriceLabels)
    const previousButtonLabel = this.getPreviousButtonLabel(showEditingPriceLabels)
    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              initialValues={{
                userPrice: userPrice
              }}
              isInitialValid={() => {
                return !this.validateUserPrice(userPrice)
              }}
              render={({isValid, setFieldTouched, setFieldValue, errors}) => (
                <>
                  {this.state.showPrice && <Steps currentStep="value" />}
                  <Text
                    fontSize="large"
                    fontWeight="bold"
                    textAlign="center">
                    Valor do seu imóvel
                  </Text>
                    {this.state.showPrice ?
                      <>
                        <Row alignItems="center" flexDirection="column">
                          <Ticket
                            hideSeparator={!suggestedPrice}
                            topRender={() =>
                              <Row px={4} pt={4} pb={suggestedPrice ? 4 : 0} flexDirection="column">
                                <Text inline fontSize="small" fontWeight="bold">{location.address}</Text>
                                {suggestedPrice ? <Row mt={2}><Text inline fontSize="xsmall" color="grey">{this.getListingSummary()}</Text></Row> : null}
                              </Row>
                            }
                            bottomRender={() =>
                              <Row px={4} pb={4} pt={suggestedPrice ? 4 : 0} flexDirection="column">
                                {suggestedPrice ?
                                  <>
                                    <Text inline fontSize="xsmall" color="grey">VALOR AVALIADO</Text>
                                    <Row justifyContent="space-between">
                                      {this.state.editingPrice ?
                                        <>
                                          {this.currencyInput(errors, setFieldValue, setFieldTouched)}
                                        </>
                                      :
                                        <>
                                          <Text inline fontSize="large" fontWeight="bold">{this.state.userPrice ? intToCurrency(this.state.userPrice) : intToCurrency(roundUpPrice(suggestedPrice))}</Text>
                                          <Col onClick={() => {
                                            if (!this.state.editingPrice) {
                                              log(`${getSellerEventPrefix(this.props.evaluation)}${SELLER_ONBOARDING_EDIT_PRICE}`)
                                            }
                                            this.setState({ editingPrice: true })
                                          }} style={{cursor: 'pointer', marginTop: 8}}>
                                            <Icon name="pen" />
                                          </Col>
                                        </>
                                      }
                                    </Row>
                                  </>
                                :
                                  <Row><Text inline fontSize="small" color="grey">{this.getListingSummary()}</Text></Row>
                                }
                              </Row>
                            }
                          />
                          {suggestedPrice && <Text textAlign="center" color="grey">Nossa avaliação é feita de acordo com os valores de mercado da sua região. Você pode editar este valor ou conversar com um de nossos especialistas no final do processo.</Text>}
                        </Row>
                        {!suggestedPrice && this.noPriceSuggestion(errors, setFieldValue, setFieldTouched)}
                        <NavButtons
                          nextButtonWidth={this.state.editingPrice ? 120 : 150}
                          previousButtonWidth={this.state.editingPrice ? 120 : 90}
                          nextLabel={nextButtonLabel}
                          previousLabel={previousButtonLabel}
                          previousStep={this.previousStep}
                          onSubmit={this.nextStep}
                          submitEnabled={isValid}
                        />
                      </>
                    :
                      <LoadingText
                        sentences={[
                          'Buscando imóveis do mesmo padrão na região',
                          'Avaliando média do m²',
                          'Comparando valores de imóveis na mesma rua'
                        ]}
                      />
                    }
                </>
              )}
            />
          </Col>
        </Container>
      </div>
    )
  }
}

Pricing.propTypes = {
  pricing: PropTypes.object
}

export default withBreakpoint()(Pricing)
