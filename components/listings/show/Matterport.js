import {Component} from 'react'
import PropTypes from 'prop-types'

export default class Matterport extends Component {
  render() {
    const {matterport_code} = this.props
    const src = `https://my.matterport.com/show/?m=${matterport_code}&play=1`

    return (
      <iframe
        width="100%"
        height="100%"
        src={src}
        frameBorder="0"
        allowFullScreen
      />
    )
  }
}

Matterport.propTypes = {
  matterport_code: PropTypes.string.isRequired
}
