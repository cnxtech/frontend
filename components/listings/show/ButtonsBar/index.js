import {Component} from 'react'
import LikeButton from 'components/shared/Common/Buttons/Like'
import {log, LISTING_DETAIL_CONTACT_BUTTON} from 'lib/logging'
import {Container, ContactButton} from './styles'

class ButtonsBar extends Component {
  render() {
    const {listing, handleOpenInterestPopup, user, favorite} = this.props

    return (
      <Container>
        <LikeButton
          textButton
          favorite={favorite}
          listing={listing}
          user={user}
        />
        <ContactButton
          active
          onClick={() => {
            log(LISTING_DETAIL_CONTACT_BUTTON, {listingId: listing.id})
            handleOpenInterestPopup()
          }}
        >
          Falar com especialista
        </ContactButton>
      </Container>
    )
  }
}

export default ButtonsBar
