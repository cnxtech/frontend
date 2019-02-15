import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Container from './styles'
import {
  log,
  LISTING_SEARCH_NOT_FOUND
} from 'lib/logging'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Button from '@emcasa/ui-dom/components/Button'
import {Query} from 'react-apollo'
import {GET_DISTRICTS} from 'graphql/listings/queries'

class NotFound extends PureComponent {
  componentDidMount() {
    log(LISTING_SEARCH_NOT_FOUND)
  }

  render() {
    const {filters, params} = this.props

    return (
      <Col px={4}>
        <Text fontWeight="bold">Nenhum imóvel encontrado</Text>
        <Text color="grey" my={0}>Tente alterar os critérios selecionados para encontrar outros imóveis.</Text>
        <Query query={GET_DISTRICTS}>
          {({loading, error, data}) => {
            const districts = data.districts

            if (loading) return (<div/>)
            if (error) return `Error! ${error.message}`

            const findState = districts.find(a => a.stateSlug === params.state)
            const findCity = districts.find(a => a.citySlug === params.city)
            let linkHref = '/imoveis'
            let linkLabel = 'Explorar imóveis'

            if (findCity) {
              linkHref = `/imoveis/${findCity.stateSlug}/${findCity.citySlug}`
              linkLabel = `Explorar imóveis em ${findCity.city}`
            } else if (findState) {
              linkHref = `/imoveis/${findState.stateSlug}`
              linkLabel = `Explorar imóveis em ${findState.state}`
            }

            return (
              <Col>
                <Link passHref href={linkHref}>
                  <a>
                    <Button
                      height="tall"
                    >
                      {linkLabel}
                    </Button>
                  </a>
                </Link>
              </Col>
            )
          }}
        </Query>
      </Col>
    )
  }
}

NotFound.propTypes = {
  filters: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
}

export default NotFound
