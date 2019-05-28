import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'
import {
  Container,
  Content,
  FakeButton,
  BreakTextMobile,
  CloseButton
} from './styles'

export default function FavMessageBar(props) {
  return (
    <Row justifyContent="center" my={2} px={[null, null, null, 4]}>
      <Container alignItems="center">
        <Content
          alignItems="center"
          justifyContent={['flex-start', null, null, 'center']}
        >
          <FakeButton>
            <Icon name="heart" />
          </FakeButton>
          <Text fontSize={[1, null, null, 2]}>
            Gostou de algum imóvel?<BreakTextMobile /> Adicione ele nos{' '}
            <strong>Favoritos</strong>.
          </Text>
        </Content>
        <CloseButton onClick={props.onClickCloseButton}>
          <Icon name="times" />
        </CloseButton>
      </Container>
    </Row>
  )
}
