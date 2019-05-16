import {Component} from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {GET_LISTINGS} from 'graphql/listings/queries'
import Link from 'next/link'
import ListingFeedGrid from './Grid'
import {Wrapper, MoreButton} from './styles'
import Row from '@emcasa/ui-dom/components/Row'

class ListingFeed extends Component {
  render() {
    const {currentUser, button, variables, title, highlight} = this.props
    return (
      <Query query={GET_LISTINGS} variables={variables} ssr={true}>
        {({error, data}) => {
          if (!data) {
            return null
          }
          if (error) {
            return `Error!: ${error}`
          }

          return (
            <Wrapper highlight={highlight}>
              <ListingFeedGrid
                title={title}
                listings={data.listings.listings}
                currentUser={currentUser}
              >
                <Row mt={4}>
                  <Link passHref href={button.href} as={button.as} passHref>
                    <MoreButton
                      inline
                      as="a"
                      onClick={button.click ? button.click : null}
                    >
                      {button.label}
                    </MoreButton>
                  </Link>
                </Row>
              </ListingFeedGrid>
            </Wrapper>
          )
        }}
      </Query>
    )
  }
}

ListingFeed.propTypes = {
  currentUser: PropTypes.object,
  variables: PropTypes.object,
  button: PropTypes.object
}

export default ListingFeed
