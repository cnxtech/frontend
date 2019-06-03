import React, { Component } from 'react'

import Col from '@emcasa/ui-dom/components/Col'
import AddressAutoComplete from '@emcasa/places-autocomplete/AddressAutoComplete'
import MobileTypeaheadContainer from 'components/shared/MobileTypeahead'

class AddressInputMobile extends Component {
  constructor(props) {
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
    this.close = this.close.bind(this)
  }

  state = {
    address: ''
  }

  selectAddress(addressFormatted, addressData) {
    this.props.updateLocation({
      address: addressFormatted,
      addressData
    })
    this.close()
  }

  close() {
    const { navigateTo } = this.props
    navigateTo('addressInput')
  }

  render() {
    return (
      <div ref={this.props.hostRef}>
        <MobileTypeaheadContainer justifyContent="center" p={4}>
          <Col width={1}>
            <AddressAutoComplete
              focused
              p={0}
              height="tall"
              placeholder="Endereço e número*"
              icon="chevron-left"
              iconProps={{
                pl: 2,
                pr: 2,
                mr: -10,
                size: 24,
                onClick: (e) => {
                  e.preventDefault()
                  this.close()
                }
              }}
              inputProps={{p: 0}}
              defaultValue={this.state.address}
              onSelect={(_, addressData, addressFormatted) => {
                this.setState({
                  address: addressFormatted
                })
                this.selectAddress(addressFormatted, addressData)
              }}
            />
          </Col>
        </MobileTypeaheadContainer>
      </div>
    )
  }
}

export default AddressInputMobile
