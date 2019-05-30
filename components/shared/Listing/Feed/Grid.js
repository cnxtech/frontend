import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import ListingCard from 'components/listings/shared/ListingCard'
import ListingsGrid from 'components/listings/shared/ListingsGrid'

class ListingFeedGrid extends Component {
  render() {
    const {children, currentUser, listings, favorites, related} = this.props
    return (
      <Fragment>
        <ListingsGrid>
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentUser={currentUser}
              favorited={favorites}
              related={related}
            />
          ))}
        </ListingsGrid>
        {children}
      </Fragment>
    )
  }
}

ListingFeedGrid.propTypes = {
  listings: PropTypes.array,
  currentUser: PropTypes.object,
  title: PropTypes.string,
  favorites: PropTypes.array,
  related: PropTypes.bool
}

export default ListingFeedGrid
