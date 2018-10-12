import React, { Component } from 'react'
import Button from '@emcasa/ui-dom/components/Button'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import Input from '@emcasa/ui-dom/components/Input'

class AddressInput extends Component {
  render() {
    return (
      <div ref={this.props.hostRef}>
        <Row justifyContent="center">
          <Col width={[1, 1/2]}>
            <View body p={4}>
              <Text
                fontSize="large"
                fontWeight="bold"
                textAlign="center"
              >
                Qual o endereço do seu imóvel?
              </Text>
              <Col width={1} mb={4}>
                <Input placeholder="Endereço e número*" />
              </Col>
              <Col width={1}>
                <Input placeholder="Complemento" />
              </Col>
            </View>
            <View bottom p={4}>
              <Row justifyContent="space-between">
                <Col width={5/12}>
                  <Button
                    fluid
                    height="tall"
                    onClick={this.props.previousStep}>Cancelar</Button>
                </Col>
                <Col width={5/12}>
                  <Button
                    fluid
                    height="tall"
                    disabled
                    onClick={this.props.nextStep}>Avançar</Button>
                </Col>
              </Row>
            </View>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AddressInput
