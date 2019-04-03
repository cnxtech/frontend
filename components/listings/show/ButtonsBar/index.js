import React, { Component } from 'react'
import theme from '@emcasa/ui'
import View from '@emcasa/ui-dom/components/View'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import LikeButton from './LikeButton'

import {
  Wrapper,
  Container
} from './styles'

class ButtonsBar extends Component {
  render() {
    const {listing, handleOpenPopup, user, favorite} = this.props

    return (
      <Wrapper>
        <Container>
          <Button active onClick={handleOpenPopup}>Falar com especialista</Button>
          <LikeButton
            favorite={favorite}
            listing={listing}
            user={user}
          />
        </Container>
      </Wrapper>
    )
  }
}

export default ButtonsBar
