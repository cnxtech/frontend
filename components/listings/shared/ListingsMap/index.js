import {PureComponent} from 'react'
import Map from '@emcasa/ui-dom/components/Map'
import Card from './Card'
import MultiMarker from './MultiMarker'
import {getListingPrice} from 'lib/listings'

export default class ListingsMap extends PureComponent {
  state = {
    highlight: undefined
  }

  selectListing = ({id}) => this.setState({highlight: id})

  setHighlight = (id) => this.setState({highlight: id})

  isHighlight = ({id}) => this.state.highlight === id

  renderListing = (listing) => {
    const {id, address: {lat, lng}} = listing
    const isHighlight = this.isHighlight(listing)
    return (
      <Map.Marker
        key={id}
        id={id}
        lat={lat}
        lng={lng}
        onClick={() => this.setHighlight(id)}
      >
        {!isHighlight ? getListingPrice(listing) : <Card id={id} />}
      </Map.Marker>
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
        onMapLoaded={console.log}
      >
        {data.map(this.renderListing)}
      </Map>
    )
  }
}
