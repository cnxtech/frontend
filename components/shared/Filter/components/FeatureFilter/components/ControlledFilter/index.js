import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import React, {PureComponent, Fragment} from 'react'
import {Field, connect} from 'formik'
import {mapProps, compose} from 'recompose'
import {Title} from '@emcasa/ui-dom/components/Filters/styles'

const popperModifiers = {
  offset: {
    fn(data) {
      if (data.placement.indexOf('top') !== -1) {
        data.offsets.popper.top -= 10
      }
      return data
    }
  }
}

export default class Filter extends PureComponent {
  static defaultProps = {
    panelProps: {}
  }
  render() {
    const {
      children,
      title
    } = this.props
    return (
      <Fragment>
        {title && <Title>{title}</Title>}
        {children}
      </Fragment>
    )
  }
}

class ControlledFilterContainer extends PureComponent {
  static defaultProps = {
    isEmpty: (value) => typeof value === 'undefined'
  }

  state = {}

  constructor(props) {
    super(props)
    this.state.value = this.props.value
  }

  componentDidUpdate(prevProps) {
    const focusChanged = prevProps.selected !== this.props.selected
    const focusedFilter = this.props.selectedValue
    if (focusChanged) {
      if (
        focusedFilter &&
        focusedFilter !== this.props.name &&
        this.state.value !== this.props.value
      )
        this.props.setFieldValue(this.props.name, this.state.value)
      else if (!focusedFilter) this.setState({value: this.props.value})
    }
  }

  onChange = (value, callback = () => {}) => {
    this.setState({value}, callback)
  }

  bindOnsubmit = (onSubmit) => {
    return (value) => {
      this.onChange(value, onSubmit)
    }
  }

  render() {
    const {
      children,
      name,
      selected,
      onSelect,
      initialValues,
      isEmpty,
      ...props
    } = this.props
    const {value} = this.state
    return (
      <Field
        name={name}
        render={({field, form}) => {
          const initialValue = get(initialValues, name)
          const appliedValue = get(form.initialValues || {}, name)
          const fieldValue = field.value
          const hasValue = Boolean(
            !isEmpty(fieldValue) && !isEqual(fieldValue, initialValues[name])
          )
          return (
            <Filter
              {...props}
              selected={selected}
              value={hasValue ? fieldValue : undefined}
              hasValue={hasValue}
              onSelect={() => {
                if (selected) {
                  form.setFieldValue(name, value)
                  requestAnimationFrame(() => {
                    onSelect()
                    form.submitForm()
                  })
                } else {
                  onSelect()
                }
              }}
              onClear={() => {
                this.setState({value: undefined})
                form.setFieldValue(name, undefined)
                requestAnimationFrame(() => {
                  onSelect()
                  form.submitForm()
                })
              }}
              onSubmit={() => {
                form.setFieldValue(name, value)
                requestAnimationFrame(() => {
                  onSelect()
                  form.submitForm()
                })
              }}
            >
              {children({
                field: {
                  ...field,
                  currentValue: value,
                  appliedValue,
                  initialValue,
                  onChange: this.onChange
                },
                form
              })}
            </Filter>
          )
        }}
      />
    )
  }
}

export const ControlledFilter = compose(
  connect,
  mapProps(({formik, ...props}) => ({
    value: formik.values[props.name],
    setFieldValue: formik.setFieldValue,
    ...props
  }))
)(ControlledFilterContainer)
