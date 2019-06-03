import React from 'react'
import axios from 'axios'
import {Title, Field} from 'components/listings/shared/styles'
import {SearchResults, FieldContainer, SearchResult} from './styles'
import {filterComponent} from '@emcasa/places-autocomplete/helpers'
import Form from 'components/shared/Common/Form'

export default class AddressAutoComplete extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      predictions: [],
      predictionSelected: 0,
      showPredictions: false,
      place: {},
      search: '',
      errors: [],
      loadingPlaceInfo: false
    }

    this.predictionsIds = []
    this.secondaryText = undefined
  }

  componentDidMount() {
    this.searchInput.focus()
  }

  searchPlaces = async (input) => {
    try {
      const response = await axios.get(
        `/maps/autocomplete?q=${encodeURI(input)}`
      )

      const {predictions} = response.data.json

      const predictionsSorted = predictions.sort(
        (a, b) => b.structured_formatting.secondary_text === this.secondaryText
      )

      this.setState({
        predictions: predictionsSorted,
        showPredictions: true,
        predictionSelected: 0,
        errors:
          predictions.length === 0
            ? [
                ...this.state.errors,
                'Não encontramos o endereço.Tente outros termos.'
              ]
            : []
      })
    } catch (e) {
      this.setState({
        errors: [...this.state.errors, 'Ocorreu um erro ao buscar o endereço.']
      })
    }
  }

  positionCursor = () => {
    const searchWord = 'número'
    const input = this.searchInput
    const startPosition = this.searchInput.value.indexOf(searchWord)

    input.setSelectionRange(startPosition, this.searchInput.value.length)
    input.focus()
  }

  setPlace = async (place) => {
    const {structured_formatting} = place
    const placeAddress = structured_formatting.main_text.split(',')
    this.secondaryText = structured_formatting.secondary_text
    if (!placeAddress[1]) {
      this.setState(
        {
          place: {},
          search: `${placeAddress[0]}, número`,
          showPredictions: false
        },
        this.positionCursor
      )
      return
    }
    const {choosePlace} = this.props
    this.setState({place, predictions: [], loadingPlaceInfo: true, errors: []})
    try {
      const response = await axios.get(
        `/maps/placeDetail?q=${encodeURI(place.place_id)}`
      )
      const json = response.data
      this.complementInput.focus()

      const street_number = filterComponent(
        json.json.result.address_components,
        'street_number'
      ).long_name
      const postal_code = filterComponent(
        json.json.result.address_components,
        'postal_code'
      ).long_name
      if (!street_number || !postal_code) {
        this.setState(
          {
            place: {},
            search: `${placeAddress[0]}, número`,
            showPredictions: false
          },
          this.positionCursor
        )
        throw {reason: 'Não encontramos um endereço válido com esse número.'}
      }
      choosePlace(json.json.result)
    } catch (e) {
      this.setState({
        errors: [
          ...this.state.errors,
          e.reason ||
            'Ocorreu um erro ao buscar informações sobre o endereço. Tente novamente'
        ]
      })
    }

    this.setState({loadingPlaceInfo: false})
  }

  getSearchResults = () => {
    const {predictions, predictionSelected, search} = this.state
    const words = search
      .replace(/,/g, ' ')
      .split(' ')
      .filter((word) => word && word.length > 0)
    const regex = new RegExp('(' + words.join('|') + ')', 'ig')
    this.predictionsIds = []
    return predictions.map((prediction, id) => {
      const formattedOutput = prediction.description.replace(
        regex,
        '<span>$1</span>'
      )

      this.predictionsIds.push(prediction.description)

      return (
        <SearchResult
          selected={id === predictionSelected}
          onClick={() => this.setPlace(prediction)}
          key={prediction.description}
        >
          <p dangerouslySetInnerHTML={{__html: formattedOutput}} />
        </SearchResult>
      )
    })
  }

  onKeyPress = (e) => {
    const {keyCode} = e
    const {
      predictions,
      predictionSelected,
      showPredictions,
      search
    } = this.state
    let newPredictionSelected = predictionSelected
    if (predictions.length > 0) {
      switch (keyCode) {
        case 9:
          search.indexOf('número') === -1
            ? this.setPlace(predictions[0])
            : this.setState({showPredictions: !showPredictions})
          break
        case 38:
          newPredictionSelected =
            predictionSelected > 0
              ? newPredictionSelected - 1
              : predictions.length - 1
          break
        case 40:
          newPredictionSelected =
            predictionSelected >= predictions.length - 1
              ? 0
              : newPredictionSelected + 1
          break
        case 13:
          const prediction = predictions.filter(
            (prediction) =>
              prediction.description ===
              this.predictionsIds[newPredictionSelected]
          )[0]
          this.setPlace(prediction)
          break
      }
    }

    this.setState({predictionSelected: newPredictionSelected})
  }

  onBlur = (e) => {
    const {listing} = this.props
    const {place} = this.state
    if (place.id || listing.id) return
    e.target.focus()
  }

  onChange = (e) => {
    const {value} = e.target
    const {resetListing} = this.props
    resetListing()
    this.setState({search: value, place: {}, errors: []})
    clearTimeout(this.timer)

    this.timer = setTimeout(this.searchPlaces.bind(null, value), 300)
  }
  render() {
    const {
      place,
      search,
      loadingPlaceInfo,
      errors,
      showPredictions
    } = this.state
    const {listing, onChange} = this.props
    const address = `${listing.street}, ${listing.street_number} - ${
      listing.neighborhood
    }, ${listing.city} - ${listing.state}, Brasil`

    return (
      <Form full errors={errors.length ? {street: errors[0]} : {}}>
        <Title>Onde fica o seu imóvel?</Title>
        <FieldContainer>
          <Field>
            <label htmlFor="street">Endereço com número</label>
            <input
              onKeyDown={this.onKeyPress}
              onBlur={this.onBlur}
              type="text"
              name="street"
              ref={(input) => (this.searchInput = input)}
              value={place.description || (listing.street ? address : search)}
              placeholder="Coloque seu endereço aqui"
              onChange={this.onChange}
              autoComplete="off"
            />
            {showPredictions && (
              <SearchResults>{this.getSearchResults()}</SearchResults>
            )}
          </Field>
          <Field>
            <label htmlFor="address">Complemento</label>
            <input
              type="text"
              name="complement"
              defaultValue={listing.complement}
              ref={(input) => {
                this.complementInput = input
              }}
              placeholder=""
              onChange={onChange}
            />
          </Field>
        </FieldContainer>

        {loadingPlaceInfo && <p>Buscando informações sobre o local...</p>}
      </Form>
    )
  }
}
