import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import Modal from 'components/shared/Modal'
import Button from '@emcasa/ui-dom/components/Button'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import {
  log,
  LISTING_SAVE_LOGIN_VIEW_FAVORITES
} from 'lib/logging'
import {
  CheckContainer,
  GreenBox
} from './styles'
import theme from '@emcasa/ui'

class FavoriteLoginSuccess extends Component {
  render() {
    return (
      <Modal
        onClose={this.props.onClose}
        onClick={(e) => {e.preventDefault()}}
        justifyContent="start"
        closeIconColor={theme.colors.white}
      >
        <GreenBox>
          <Row justifyContent="center">
            <CheckContainer>
              <FontAwesomeIcon icon={faCheck} />
            </CheckContainer>
          </Row>
          <Row m={2} justifyContent="center">
            <Text fontWeight="bold" textAlign="center" color="white">Seu imóvel foi salvo com sucesso.</Text>
          </Row>
        </GreenBox>
        <Row flexDirection="column" justifyContent="center" p={4}>
          <Col justifyContent="center" mt="40px">
            <Text textAlign="center">A partir de agora, os imóveis salvos vão aparecer na sua aba de Favoritos.</Text>
          </Col>
          <Row alignItems="center" flexDirection="column">
            <Col mt="40px">
              <Link href={{pathname: '/meu-perfil/favoritos'}}><a>
                <Button onClick={() => {log(LISTING_SAVE_LOGIN_VIEW_FAVORITES)}}>Ver Favoritos</Button>
              </a></Link>
            </Col>
            <Col mt={4}>
              <Button onClick={this.props.onClose}>Ver outros imóveis</Button>
            </Col>
          </Row>
        </Row>
      </Modal>
    )
  }
}

FavoriteLoginSuccess.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default FavoriteLoginSuccess
