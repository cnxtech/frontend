import merge from 'lodash/merge'
import {PureComponent} from 'react'
import Map from '@emcasa/ui-dom/components/Map'
import Card from './Card'
import Marker from './Marker'
import MultiMarker from './MultiMarker'
import {getListingPrice} from 'lib/listings'

export default class ListingsMap extends PureComponent {
  static defaultProps = {
    getListingData: () => undefined,
    isFavorite: () => undefined
  }

  state = {
    highlight: undefined
  }

  selectListing = ({id}) => this.setState({highlight: id})

  setHighlight = ({id}) => this.setState({highlight: id})

  isHighlight = ({id}) => this.state.highlight === id

  onMapLoaded = ({map}) => {
    if (map) map.addListener('click', this.onClickMarker)
  }

  onClickMarker = (e) => {
    if (e.placeId) {
      // Prevent place info popup from showing.
      e.stop()
    }
  }

  onChange = (bounds, framedPoints) => {
    if (framedPoints.length === 1) this.setHighlight({id: framedPoints[0]})
    if (this.props.onChange) this.props.onChange(bounds, framedPoints)
  }

  renderListing = (listing) => {
    const {user, isFavorite, getListingData} = this.props
    const {id, address: {lat, lng}} = listing
    const isHighlight = this.isHighlight(listing)
    return (
      <Marker
        key={id}
        id={id}
        lat={lat}
        lng={lng}
        highlight={isHighlight}
        onClick={() => this.setHighlight({id})}
      >
        {!isHighlight ? (
          getListingPrice(listing)
        ) : (
          <Card
            id={listing.id}
            user={user}
            listing={getListingData(listing)}
            favorite={isFavorite(listing)}
          />
        )}
      </Marker>
    )
  }

  render() {
    const {children, data, options, ...props} = this.props
    return (
      <Map
        cluster
        apiKey={process.env.GOOGLE_MAPS_KEY}
        highlight={this.isHighlight}
        {...props}
        options={merge(
          {
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{visibility: 'on'}]
              }
            ]
          },
          options
        )}
        MultiMarker={MultiMarker}
        getClusterProps={(props) => ({
          currentIndex: props.points.filter(Boolean).findIndex(this.isHighlight),
          onChangePage: this.setHighlight,
          ...props
        })}
        onChange={this.onChange}
        onMapLoaded={this.onMapLoaded}
      >
        {children}
        {data.map(this.renderListing)}
      </Map>
    )
  }
}
