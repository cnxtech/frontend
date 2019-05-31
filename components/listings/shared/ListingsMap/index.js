import merge from 'lodash/merge'
import React, {PureComponent, Fragment} from 'react'
import Map from '@emcasa/ui-dom/components/Map'
import View from '@emcasa/ui-dom/components/View'
import Card from './Card'
import Marker from './Marker'
import MultiMarker from './MultiMarker'
import {getListingPrice} from 'lib/listings'

class ListingsMap extends PureComponent {
  static defaultProps = {
    getListingData: () => undefined,
    isFavorite: () => undefined
  }

  state = {
    highlight: undefined
  }

  modalRef = React.createRef()

  setHighlight = (listing) =>
    this.setState({highlight: listing.id}, () => {
      if (this.props.onSelect) this.props.onSelect(listing)
    })

  isHighlight = ({id}) => this.state.highlight === id

  onMapLoaded = (options) => {
    if (options.map) options.map.addListener('click', this.onClickMarker)
    if (this.props.onMapLoaded) this.props.onMapLoaded(options)
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
            loginContainer={this.modalRef.current}
          />
        )}
      </Marker>
    )
  }

  render() {
    const {
      children,
      data,
      options,
      mapRef,
      onClickCluster,
      ...props
    } = this.props
    return (
      <Fragment>
        <View ref={this.modalRef} />
        <Map
          cluster
          ref={mapRef}
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
            ...props,
            currentIndex: props.points
              .filter(Boolean)
              .findIndex(({id}) => id == this.state.highlight),
            onChangePage: props.isMultiMarker ? this.setHighlight : undefined,
            onClick: (...args) => {
              if (!props.isMultiMarker && onClickCluster)
                onClickCluster(...args)
              props.onClick(...args)
            }
          })}
          onChange={this.onChange}
          onMapLoaded={this.onMapLoaded}
        >
          {children}
          {data.map(this.renderListing)}
        </Map>
      </Fragment>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <ListingsMap {...props} mapRef={ref} />
))
