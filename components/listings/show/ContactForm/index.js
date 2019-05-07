import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import theme from '@emcasa/ui'
import Text from '@emcasa/ui-dom/components/Text'
import View from '@emcasa/ui-dom/components/View'
import Button from '@emcasa/ui-dom/components/Button'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Input from '@emcasa/ui-dom/components/Input'
import Modal from 'components/shared/Modal'
import InstructionText from './InstructionText'
import {getPhoneMask} from 'utils/text-utils'
import {
  log,
  LISTING_DETAIL_VISIT_FORM_NAME_INPUT,
  LISTING_DETAIL_VISIT_FORM_PHONE_INPUT,
  LISTING_DETAIL_VISIT_FORM_ERROR
} from 'lib/logging'
import {
  PinkBox,
  Logo,
  StyledInput
} from './styles'

class ContactForm extends Component {
  constructor(props) {
    super(props)
    this.nameField = React.createRef()
    this.phoneField = React.createRef()
  }

  state = {
    nameFieldValid: false,
    phoneFieldValid: false,
    showSuccess: false,
    mobileKeyboard: false,
    nameTouched: false,
    phoneTouched: false,
    loading: false
  }

  componentDidMount() {
    document.addEventListener('keypress', this.onPressEnter)
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.onPressEnter)
  }

  onPressEnter = (e) => {
    if (e.key !== 'Enter') return
    if (this.state.nameFieldValid && this.state.phoneFieldValid) {
      this.submit()
    }
  }

  validateNameField = (event) => {
    const valid = event && event.target && event.target.value && event.target.value.trim()
    this.setState({nameFieldValid: valid})
  }

  validatePhoneField = (event) => {
    const valid = event && event.target && event.target.value && event.target.value.trim()
    this.setState({phoneFieldValid: valid})
  }

  submit = (e) => {
    if (this.nameField && this.nameField.current && this.phoneField) {
      const name = this.nameField.current.value ? this.nameField.current.value.trim() : ''
      const phone = this.phoneField.value ? this.phoneField.value.trim() : ''
      this.setState({loading: true})
      this.props.onSubmit(e, {name, phone}, (error) => {
        log(LISTING_DETAIL_VISIT_FORM_ERROR, {
          listingId: this.props.listing.id,
          name,
          phone,
          error
        })
        this.setState({
          loading: false,
          error
        })
      })
    }
  }

  logInputTouched = (e, stateKey, eventName) => {
    const {value} = e.target
    if (!this.state[stateKey] && value) {
      log(eventName)
    }
    if (value) {
      this.setState({[stateKey]: true})
    }
  }

  render() {
    const {onClose} = this.props
    return (
      <Modal
        onClose={onClose}
        mobileKeyboard={this.state.mobileKeyboard}
        closeButtonStyle={{backgroundColor: 'transparent', border: 0}}
        closeIconColor={theme.colors.white}
      >
        <PinkBox>
          <Logo />
          <View px={4} pt={4}>
            <Text textAlign="center" color="white">Olá, você está mais perto de encontrar sua nova casa.</Text>
          </View>
        </PinkBox>
        <InstructionText />
        <Row justifyContent="space-around">
          <Col width={1/2} ml={4} mr={2}>
            <StyledInput
              fluid
              label="Nome"
              height="medium"
              placeholder="Maria da Silva"
              onFocus={() => {this.setState({mobileKeyboard: true})}}
              onBlur={() => {this.setState({mobileKeyboard: false})}}
              onChange={(e) => {
                this.logInputTouched(e, 'nameTouched', LISTING_DETAIL_VISIT_FORM_NAME_INPUT)
                this.validateNameField(e)
              }}
              ref={this.nameField}
            />
          </Col>
          <Col width={1/2} ml={2} mr={4}>
            <MaskedInput
              mask={getPhoneMask(this.phoneField && this.phoneField.value ? this.phoneField.value : null)}
              placeholderChar=" "
              render={(ref, props) =>
                <StyledInput
                  {...props}
                  ref={(input) => {
                    ref(input)
                    this.phoneField = input
                  }}
                  fluid
                  label="Celular"
                  height="medium"
                  type="tel"
                  placeholder="(11) 11111-1111"
                  onFocus={() => {this.setState({mobileKeyboard: true})}}
                  onBlur={() => {this.setState({mobileKeyboard: false})}}
                  onChange={(e) => {
                    this.logInputTouched(e, 'phoneTouched', LISTING_DETAIL_VISIT_FORM_PHONE_INPUT)
                    this.validatePhoneField(e)
                  }}
                  onKeyDown={(e) => {
                    const value = e.target.value
                    if (e.keyCode === 8 && value && value.length > 0) {
                      e.preventDefault()
                      const cursorPosition = e.target.selectionStart
                      e.target.value = value.substring(0, cursorPosition - 1)
                    }
                  }}
                />
              }
            />
          </Col>
        </Row>
        <Row alignItems="center" flexDirection="column">
          <Button
            active
            onClick={this.submit}
            disabled={!(this.state.nameFieldValid && this.state.phoneFieldValid) || this.state.loading}
          >
            Solicitar atendimento
          </Button>
          {!this.state.loading && <Text textAlign="center" color={theme.colors.red}>{this.state.error && 'Ocorreu um erro. Por favor, tente novamente.'}</Text>}
        </Row>
      </Modal>
    )
  }
}

ContactForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired,
  error: PropTypes.string
}

export default ContactForm
