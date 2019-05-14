import {Component} from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {GET_LISTINGS} from 'graphql/listings/queries'
import Link from 'next/link'
import ListingFeedGrid from './Grid'
import {Wrapper, MoreButtonWrapper, MoreButton} from './styles'

class ListingFeed extends Component {
  render() {
    const {currentUser, button, variables, title} = this.props
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
            <Wrapper>
              <ListingFeedGrid
                title={title}
                listings={data.listings.listings}
                currentUser={currentUser}
              >
                <MoreButtonWrapper>
                  <Link passHref href={button.href} as={button.as} passHref>
                    <MoreButton
                      as="a"
                      height="tall"
                      onClick={button.click ? button.click : null}
                    >
                      {button.label}
                    </MoreButton>
                  </Link>
                </MoreButtonWrapper>
              </ListingFeedGrid>
            </Wrapper>
          )
        }}
      </Query>
    )
  }
}

ListingFeed.propTypes = {
  currentListing: PropTypes.array,
  currentUser: PropTypes.object,
  variables: PropTypes.object,
  button: PropTypes.object
}

export default ListingFeed
