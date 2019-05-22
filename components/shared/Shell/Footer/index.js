import {ThemeProvider} from 'styled-components'
import theme from 'config/theme'
import Link from 'next/link'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPhone from '@fortawesome/fontawesome-pro-light/faPhone'
import faMail from '@fortawesome/fontawesome-pro-light/faEnvelope'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faWhatsapp
} from '@fortawesome/fontawesome-free-brands'
import {
  Wrapper,
  Container,
  AboutContainer,
  AboutText,
  LogoWrapper,
  LinksContainer,
  TitleLinks,
  TextLink
} from './styles'
import Logo from 'components/shared/Logo'

const titleText = {
  fontWeight: 'bold'
}

const Footer = () => (
  <ThemeProvider theme={theme}>
    <Wrapper>
      <Container>
        <AboutContainer>
          <LogoWrapper>
            <Logo logoFill={theme.colors.white} textFill={theme.colors.white} />
          </LogoWrapper>
          <AboutText fontSize="small" color="disabled">
            A EmCasa é uma imobiliária que utiliza dados para recomendar imóveis
            com base no perfil de cada pessoa. Nossos especialistas fazem a
            intermediação no processo de compra e venda, conduzindo a negociação
            e simplificando a burocracia.
          </AboutText>
          <AboutText fontSize="small" color="disabled">CRECI-RJ J-7712</AboutText>
        </AboutContainer>
        <LinksContainer>
          <Row flexDirection="column">
            <TitleLinks {...titleText}>EmCasa</TitleLinks>
            <Link passHref href="/listings" as="/imoveis">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Compre</TextLink>
            </Link>
            <Link passHref href="/listings/sell" as="/vender">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Venda</TextLink>
            </Link>
            <Link passHref href="/avaliacao-imovel">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Avalie seu imóvel</TextLink>
            </Link>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://blog.emcasa.com" target="_blank" rel="noopener">Blog</TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://www.linkedin.com/company/emcasa/jobs/" target="_blank" rel="noopener">Trabalhe Conosco</TextLink>
            <Link passHref href="/corretor-parceiro-rj">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Seja um corretor parceiro no RJ</TextLink>
            </Link>
            <Link passHref href="/corretor-parceiro-sp">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Seja um corretor parceiro em SP</TextLink>
            </Link>
            <Link passHref href="/sitemap">
              <TextLink as="a" fontSize={[1, null, null, 2]}>Mapa do Site</TextLink>
            </Link>
          </Row>
          <Row flexDirection="column">
            <TitleLinks {...titleText}>Suporte</TitleLinks>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="tel:+551140630541">
              <FontAwesomeIcon icon={faPhone} />
              SP: (11) 4063-0541
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="tel:+552131956541">
              <FontAwesomeIcon icon={faPhone} />
              RJ: (21) 3195-6541
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://wa.me/5521994771868">
              <FontAwesomeIcon icon={faWhatsapp} />
              WhatsApp
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="mailto:contato@emcasa.com">
              <FontAwesomeIcon icon={faMail} />
              Fale com a gente
            </TextLink>
          </Row>
          <Row flexDirection="column">
            <TitleLinks {...titleText}>Redes Sociais</TitleLinks>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://www.facebook.com/EmCasa" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faFacebook} />
              Facebook
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://www.instagram.com/emcasa" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faInstagram} />
              Instagram
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://www.linkedin.com/company/emcasa" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faLinkedin} />
              LinkedIn
            </TextLink>
            <TextLink as="a" fontSize={[1, null, null, 2]} href="https://twitter.com/EmCasaTech" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faTwitter} />
              Twitter
            </TextLink>
          </Row>
        </LinksContainer>
      </Container>
    </Wrapper>
  </ThemeProvider>
)

export default Footer
