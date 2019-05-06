import React, {Component } from 'react'
import
  Container,
  {
    Wrapper,
    Header,
    HeaderLeft,
    HeaderRight,
    Title,
    Content,
    Background
} from './styles'
import CloseButton from 'components/shared/Common/Buttons/CloseButton'

class Popup extends Component {
  componentDidMount() {
    this.keyListener = window.addEventListener('keyup', (event) => {
      if (event.defaultPrevented) {
        return
      }

      switch (event.keyCode) {
        case 27:
          if (this.props.isPopupVisible) {
            this.props.closePopup()
          }
          break
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyListener)
  }

  render() {
    const {
      listing,
      isPopupVisible,
      closePopup,
      title,
      headerContent
    } = this.props

    return (
      <Container open={isPopupVisible}>
        <CloseButton onClick={closePopup} />
        <Wrapper
          width="100%"
          height="100%"
          flexDirection="column"
        >
          <Header>
            <HeaderLeft>
              <Title fontWeight="bold">{title}</Title>
            </HeaderLeft>
            <HeaderRight>
              {headerContent}
            </HeaderRight>
          </Header>
          <Content>{this.props.children}</Content>
        </Wrapper>
        <Background onClick={closePopup} />
      </Container>
    )
  }
}

export default Popup
