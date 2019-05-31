import {Component} from 'react'
import PropTypes from 'prop-types'
import Map from '@emcasa/ui-dom/components/Map'
import Card from './Card'
import Marker from './Marker'
import MultiMarker from './MultiMarker'
import {getListingPrice} from 'lib/listings'
import {log} from 'lib/logging'

class ListingsMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      highlight: undefined
    }
    this.map = null
  }

  static defaultProps = {
    isFavorite: () => false
  }

  selectListing = ({id}) => this.setState({highlight: id})

  setHighlight = ({id}) => this.setState({highlight: id})

  isHighlight = ({id}) => this.state.highlight === id

  onMapLoaded = ({map}) => {
    if (map) {
      this.map = map
      this.map.addListener('click', this.onClickMarker)
      this.map.addListener('dragend', this.onMapDragEnd)
      this.map.addListener('zoom_changed', this.onMapZoomChanged)
    }
  }

  onClickMarker = (e, params) => {
    if (e.placeId) {
      // Prevent place info popup from showing.
      e.stop()
    }

    if (this.props.clickMarkerEvent) {
      log(this.props.clickMarkerEvent)
    }
    this.map.setCenter(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()))
  }

  onMapDragEnd = () => {
    if (this.props.dragendEvent) {
      log(this.props.dragendEvent)
    }
  }

  onMapZoomChanged = () => {
    if (this.props.zoomchangedEvent) {
      log(this.props.zoomchangedEvent)
    }
  }

  onChange = (bounds, framedPoints) => {
    if (framedPoints.length === 1) this.setHighlight({id: framedPoints[0]})
  }

  renderListing = (listing) => {
    const {user, isFavorite} = this.props
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
          <Card listing={listing} user={user} favorite={isFavorite(listing)} />
        )}
      </Marker>
    )
  }

  render() {
    const {data, ...props} = this.props
    return (
      <Map
        cluster
        apiKey={process.env.GOOGLE_MAPS_KEY}
        highlight={this.isHighlight}
        {...props}
        options={{
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{visibility: 'on'}]
            }
          ]
        }}
        MultiMarker={MultiMarker}
        getClusterProps={(props) => ({
          currentIndex: props.points.findIndex(
            ({id}) => id == this.state.highlight
          ),
          onChangePage: this.setHighlight,
          ...props
        })}
        onChange={this.onChange}
        onMapLoaded={this.onMapLoaded}
      >
        {data.map(this.renderListing)}
      </Map>
    )
  }
}

ListingsMap.propTypes = {
  data: PropTypes.array,
  clickMarkerEvent: PropTypes.string,
  dragendEvent: PropTypes.string,
  zoomchangedEvent: PropTypes.string
}

export default ListingsMap
