import React from 'react'
import Container from './styles'

export default class Lightbox extends React.Component {
  render() {
    const {handleClose} = this.props

    return (
      <Container>
        <button className="btn" onClick={handleClose}>×</button>
        {this.props.children}
      </Container>
    )
  }
}
