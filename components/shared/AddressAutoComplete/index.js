import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {MoonLoader} from 'react-spinners'
import theme from 'config/theme'
import {filterComponent} from '@emcasa/places-autocomplete/helpers'
import Input from '@emcasa/ui-dom/components/Input'
import Col from '@emcasa/ui-dom/components/Col'
import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import {
  SearchResultContainer,
  SearchResultItem,
  InputContainer,
  BackIcon
} from './styles'

export default class AddressAutoComplete extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.searchInput = React.createRef()
    this.inputContainer = React.createRef()
    this.predictionsIds = []
    this.secondaryText = undefined
  }

  state = {
    dirty: false,
    predictions: [],
    predictionSelected: 0,
    showPredictions: false,
    place: {},
    search: '',
    errors: [],
    loadingPlaceInfo: false
  }

  static propTypes = {
    searchResultsMargin: PropTypes.number,
    defaultValue: PropTypes.string,
    onSelectAddress: PropTypes.func.isRequired,
    onClearInput: PropTypes.func,
    onBackPressed: PropTypes.func
  }

  static defaultProps = {
    defaultValue: ''
  }

  componentDidMount() {
    if (this.searchInput.current) {
      this.searchInput.current.focus()
    }
  }

  searchPlaces = async (input) => {
    if (!input) {
      return
    }
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
                'Endereço não encontrado. Tente outros termos.'
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
    const input = this.searchInput.current
    const startPosition = input.value.indexOf(searchWord)

    input.setSelectionRange(startPosition, input.value.length)
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
    const {onSelectAddress} = this.props
    this.setState({place, predictions: [], loadingPlaceInfo: true, errors: []})
    try {
      const response = await axios.get(
        `/maps/placeDetail?q=${encodeURI(place.place_id)}`
      )

      const json = response.data
      const addressData = json.json.result
      const street_number = filterComponent(
        addressData.address_components,
        'street_number'
      ).long_name
      const postal_code = filterComponent(
        addressData.address_components,
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

      const addressFormatted =
        structured_formatting.main_text +
        ' - ' +
        structured_formatting.secondary_text
      onSelectAddress(addressFormatted, addressData)
    } catch (e) {
      console.log(e)
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
      const formattedOutput = prediction.description.replace(regex, '$1')

      this.predictionsIds.push(prediction.description)

      return (
        <SearchResultItem
          selected={id === predictionSelected}
          onClick={() => this.setPlace(prediction)}
          key={prediction.description}
        >
          <Text>{formattedOutput}</Text>
        </SearchResultItem>
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
          e.preventDefault()
          break
      }
    }

    this.setState({predictionSelected: newPredictionSelected})
  }

  onChange = (e) => {
    const {value} = e.target
    this.setState({
      dirty: true,
      search: value,
      place: {},
      errors: []
    })
    clearTimeout(this.timer)
    this.timer = setTimeout(this.searchPlaces.bind(null, value), 300)

    const {onClearInput} = this.props
    if (onClearInput) {
      if (!value || value === '') {
        onClearInput()
      }
    }
  }

  render() {
    const {
      dirty,
      place,
      search,
      loadingPlaceInfo,
      showPredictions,
      errors
    } = this.state
    const value = place.description ? place.description : search
    const {onBackPressed, defaultValue} = this.props
    let suggestionsWidth = null
    if (this.inputContainer && this.inputContainer.current) {
      suggestionsWidth = this.inputContainer.current.offsetWidth
    }
    return (
      <div ref={this.inputContainer}>
        <InputContainer>
          {onBackPressed && (
            <BackIcon name="arrow-left" color="dark" onClick={onBackPressed} />
          )}
          <Col width={1}>
            <Input
              style={{border: 0}}
              hideLabelView
              hideErrorView
              onKeyDown={this.onKeyPress}
              type="text"
              name="street"
              ref={this.searchInput}
              value={dirty ? value : defaultValue}
              placeholder="Endereço e número*"
              onChange={this.onChange}
              autoComplete="off"
            />
          </Col>
          {loadingPlaceInfo && (
            <View mr={2}>
              <MoonLoader
                size={24}
                color={theme.colors.pink}
                style={{marginRight: 14}}
                loading={loadingPlaceInfo}
              />
            </View>
          )}
        </InputContainer>
        {errors.length > 0 && (
          <Text inline color="red" fontSize="small">
            {errors[0]}
          </Text>
        )}
        {showPredictions && (
          <SearchResultContainer width={suggestionsWidth}>
            <Col width={[1]}>{this.getSearchResults()}</Col>
          </SearchResultContainer>
        )}
      </div>
    )
  }
}
