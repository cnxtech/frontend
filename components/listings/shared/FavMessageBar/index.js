import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHeart from '@fortawesome/fontawesome-free-solid/faHeart'
import {
  Container,
  Content,
  FakeButton,
  BreakTextMobile,
  CloseButton
} from './styles'

export default function FavMessageBar(props) {
  return (
    <Row justifyContent="center" my={4} my={2}>
      <Container alignItems="center">
        <Content
          alignItems="center"
          justifyContent={['flex-start', null, null, 'center']}
        >
          <FakeButton>
            <FontAwesomeIcon icon={faHeart} size="1x" />
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
