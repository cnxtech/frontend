import React, {Component} from 'react'
import PropTypes from 'prop-types'
import enhanceWithClickOutside from 'react-click-outside'
import {Background, Container} from './styles'

class ContainerClickOutside extends Component {
  handleClickOutside(e) {
    e.preventDefault()
    this.props.onClose()
  }

  render() {
    return <Container {...this.props} />
  }
}

const EnhancedContainer = enhanceWithClickOutside(ContainerClickOutside)

class Modal extends Component {
  render() {
    return (
      <Background>
        <EnhancedContainer
          padding={this.props.padding}
          justifyContent={this.props.justifyContent}
          onClose={this.props.onClose}
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {this.props.children}
        </EnhancedContainer>
      </Background>
    )
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  justifyContent: PropTypes.string
}

export default Modal