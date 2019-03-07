import {Component} from 'react'
import {InputWithMask, Field} from 'components/listings/shared/styles'
import Form from 'components/shared/Common/Form'
import {FieldContainer} from './styles'
import Counter from 'components/shared/Common/Counter'
import {
  log,
  ESTIMATE_PRICE_HOME_DETAILS
} from 'lib/logging'

export default class PropertyInfo extends Component {
  componentDidMount() {
    log(ESTIMATE_PRICE_HOME_DETAILS)
  }

  render() {
    const {onChange, errors} = this.props

    return (
      <Form onSubmit={(e) => e.preventDefault()} full errors={errors}>
        <FieldContainer>
          <Field aria-label="area">
            <label htmlFor="area">Área (em m²)</label>
            <InputWithMask
              type="text"
              name="area"
              placeholder="Área"
              autoComplete="off"
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/]}
              guide={false}
              onChange={onChange}
            />
          </Field>
          <Field aria-label="rooms">
            <label>Nᵒ quartos</label>
            <Counter onChange={onChange} name="rooms" />
          </Field>
          <Field aria-label="bathrooms">
            <label>Nᵒ banheiros</label>
            <Counter onChange={onChange} name="bathrooms" />
          </Field>
          <Field aria-label="garageSpots">
            <label>Nᵒ vagas garagem</label>
            <Counter onChange={onChange} name="garageSpots" />
          </Field>
        </FieldContainer>
      </Form>
    )
  }
}
