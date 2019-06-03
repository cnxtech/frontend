import React, { Component } from 'react'
import { Formik, Field } from 'formik'
import Container from 'components/listings/new-listing/shared/Container'
import { ADDRESS_IS_COVERED } from 'graphql/listings/queries'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import Input from '@emcasa/ui-dom/components/Input'
import {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import StaticMap from 'components/listings/new-listing/shared/StaticMap'
import { getAddressInput } from 'lib/address'
import NavButtons from 'components/listings/new-listing/shared/NavButtons'
import AddressAutoComplete from '@emcasa/places-autocomplete/AddressAutoComplete'
import MobileAddressButton from 'components/shared/MobileAddressButton'
import Steps from 'components/listings/new-listing/shared/Steps'

class AddressInput extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
    this.checkAddressCoverage = this.checkAddressCoverage.bind(this)
    this.validateAddress = this.validateAddress.bind(this)
    this.updateStateFromProps = this.updateStateFromProps.bind(this)
    this.openMobileAddressInput = this.openMobileAddressInput.bind(this)
  }

  state = {
    address: null,
    complement: null,
    addressData: null,
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
    const { location } = props
    if (location) {
      this.setState({
        address: location.address,
        complement: location.complement,
        addressData: location.addressData,
      })
    }
  }

  updateLocation() {
    const { updateLocation } = this.props
    updateLocation({
      address: this.state.address,
      complement: this.state.complement,
      addressData: this.state.addressData
    })
  }

  onChangeAddressText = (address) => {
    const nextState = {address}
    if (!address) nextState.addressData = undefined
    this.setState(nextState)
  }

  previousStep() {
    const { navigateTo } = this.props
    navigateTo('intro')
  }

  nextStep() {
    const { navigateTo } = this.props
    navigateTo('homeDetails')
  }

  async checkAddressCoverage() {
    this.setState({loading: true})

    const input = getAddressInput(this.state.addressData)
    try {
      const { data } = await apolloClient.query({
        query: ADDRESS_IS_COVERED,
        variables: {
          city: input.city,
          neighborhood: input.neighborhood,
          state: input.state
        }
      })

      this.setState({loading: false})
      this.updateLocation()
      const { addressIsCovered } = data
      if (addressIsCovered) {
        this.nextStep()
      } else {
        const { navigateTo } = this.props
        navigateTo('notifyCoverage')
      }

    } catch (e) {
      this.setState({
        loading: false,
        error: 'Ocorreu um erro ao validar o endereço. Por favor, tente novamente.'
      })
    }
  }

  validateAddress(value) {
    if (!value) {
      return 'É necessário preencher um endereço'
    }
  }

  openMobileAddressInput() {
    this.props.navigateTo('addressInputMobile')
  }

  render() {
    const { location } = this.props
    let address = '', complement
    if (location) {
      address = location.address
      complement = location.complement
    }
    return (
      <div ref={this.props.hostRef}>
        <Container>
          <Col width={[1,null,null,1/2]}>
            <Formik
              initialValues={{
                address: address,
                complement: complement
              }}
              isInitialValid={() => {
                return !(this.validateAddress(address))
              }}
              render={({isValid, setFieldValue, errors}) => (
                <>
                  <Steps currentStep="address" />
                  <Row justifyContent="center">
                    <Text as="h1" fontSize="large" textAlign="center">
                      Qual o endereço do seu imóvel?
                    </Text>
                  </Row>
                  <Col>
                    <StaticMap animated={true} addressData={this.state.addressData} />
                  </Col>
                  {this.props.isMobile ?
                    <Col mb={4}>
                      <MobileAddressButton
                        onClick={this.openMobileAddressInput}
                        address={address}
                      />
                    </Col>
                  :
                    <Col mb={4}>
                      <Field
                        name="address"
                        validate={this.validateAddress}
                        render={() => (
                          <AddressAutoComplete
                            p={0}
                            height="tall"
                            placeholder="Endereço e número*"
                            icon={null}
                            inputProps={{p:0}}
                            defaultValue={address}
                            onChangeText={this.onChangeAddressText}
                            onSelect={(_, addressData, address) => {
                              setFieldValue('address', address)
                              this.setState({address, addressData})
                            }}
                          />
                        )}
                      />
                    </Col>
                  }
                  <Row>
                    <Col width={1}>
                      <Field
                        name="complement"
                        render={() => (
                          <Input
                            hideLabelView
                            hideErrorView
                            placeholder="Complemento"
                            defaultValue={complement}
                            onChange={(e) => {
                              const { value } = e.target
                              setFieldValue('complement', value)
                              this.setState({complement: value})
                            }}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col width={1}>
                      <NavButtons
                        submitEnabled={isValid}
                        loading={this.state.loading}
                        previousStep={this.previousStep}
                        onSubmit={() => {
                          this.checkAddressCoverage()
                        }}
                      />
                    </Col>
                  </Row>
                </>
              )}
            />
          </Col>
        </Container>
      </div>
    )
  }
}

export default withBreakpoint()(AddressInput)
