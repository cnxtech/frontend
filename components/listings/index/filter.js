import { Component } from 'react'
import Router from 'next/router'
import NumberFormat from 'react-number-format'

import * as colors from '../../../constants/colors'

export default class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      areFiltersVisible: false,
      bairros: {}
    }
  }

  handleNeighborhoodChange = (e) => {
    const { bairros } = this.state

    if (bairros[e.target.value] == true) {
      delete bairros[e.target.value]
    } else {
      bairros[e.target.value] = true
    }

    this.setState({ bairros: bairros })
  }

  joinParam = (param) => {
    if (param !== null && typeof param === 'object') {
      return Object.keys(param).map(function(key) {
        return key
      }).join('|')
    } else {
      return param
    }
  }

  treatParams = () => {
    const that = this

    return Object.keys(this.state).map(function(key) {
      if (key === 'areFiltersVisible') return null

      const flattenedValue = that.joinParam(that.state[key])
      return (flattenedValue === '') ? null : `${key}=${flattenedValue}`
    }).join('&')
  }

  handleSubmit = () => {
    const { bairros } = this.state
    const params = this.treatParams()

    if (params) {
      Router.push(`/?${params}`).then(() => window.scrollTo(0, 0))
    }
  }

  handleInputChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  handleToggleFilterVisibility = () => {
    const state = this.state
    state.areFiltersVisible = !state.areFiltersVisible
    this.setState(state)
  }

  render() {
    const { neighborhoods } = this.props
    const { areFiltersVisible } = this.state

    const minPriceOptions = [750000, 1000000, 2000000, 3000000, 5000000]
    const maxPriceOptions = [1000000, 2000000, 3000000, 5000000, 10000000]

    return <div className="container">
      <div className="price-container">
        <div>
          <label>Preço</label>
          <select name="min_price" onChange={this.handleInputChange}>
            <option value="">sem mínimo</option>
            {minPriceOptions.map(function(option) {
              return <option value={option}>
                <NumberFormat value={option} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} decimalSeparator={','} />
              </option>
            })}
          </select>

          <label>a</label>

          <select name="max_price" onChange={this.handleInputChange}>
            <option value="">sem máximo</option>
            {maxPriceOptions.map(function(option) {
              return <option value={option}>
                <NumberFormat value={option} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} decimalSeparator={','} />
              </option>
            })}
          </select>
        </div>

        {!!areFiltersVisible && <span onClick={this.handleToggleFilterVisibility}>
          Menos Filtros<span>›</span>
        </span>}

        {!areFiltersVisible && <span onClick={this.handleToggleFilterVisibility}>
          Mais Filtros<span>‹</span>
        </span>}
      </div>


      {!!areFiltersVisible && <div>
        <div>
          <label>Área</label>
          <input type="text" name="area_minima" onChange={this.handleInputChange} />
          <label>a</label>
          <input type="text" name="area_maxima" onChange={this.handleInputChange} />
        </div>

        <div>
          <label>Quartos</label>
          <input type="text" name="quartos" onChange={this.handleInputChange} />
        </div>

        <div>
          <label className="neighborhood">Bairros</label>
          {neighborhoods && neighborhoods.map((bairro, i) => {
            return <div key={i} className="neighborhood">
              <input type="checkbox" value={bairro} onClick={this.handleNeighborhoodChange} />
              <label>{bairro}</label>
            </div>
          })}
        </div>

        <button onClick={this.handleSubmit}>Buscar</button>
      </div>}

      <style jsx>{`
        div.container {
          border-bottom: 1px solid ${colors.lightGray};
          overflow: auto;
          > div {
            display: block;
            &.price-container {
              align-items: center;
              display: flex;
              justify-content: space-between;
              span {
                  color: ${colors.blue};
                  cursor: pointer;
                  float: right;
                  margin-right: 20px;
                  > span {
                    margin-left: 5px;
                    transform: rotate(-90deg);
                  }
                }
              }
            div {
              padding: 10px;
            }
          }
        }

        div.neighborhood {
          float: left;
          width: 200px;
        }

        label {
          margin-right: 10px;
          &.neighborhood {
            clear: both;
            float: left;
            width: 100% !important;
          }
          &:first-of-type {
            display: inline-block;
            width: 70px;
          }
        }

        input {
          margin-right: 10px;
          padding: 10px;
        }

        select {
          margin-right: 10px;
        }

        button {
          clear: both;
          float: right;
          font-size: 18px;
          margin: 10px 20px;
          padding: 7px 20px 10px;
        }
      `}</style>
    </div>
  }
}
