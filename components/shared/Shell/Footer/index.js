import {Fragment} from 'react'
import Link from 'next/link'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter
} from '@fortawesome/fontawesome-free-brands'

import Container, {EmCasaInfo, EmCasaContact} from './styles'
import PreFooter from 'components/shared/Shell/Footer/PreFooter'

const Footer = () => (
  <Fragment>
    <PreFooter />
    <Container>
      <EmCasaInfo>
        <Link passHref href="/">
          <a>
            <img
              src="/static/emcasa-imobiliaria-rio-de-janeiro.png"
              alt="Emcasa Imobiliária no Rio de Janeiro"
            />
          </a>
        </Link>
      </EmCasaInfo>

      <EmCasaContact>
        <span> CRECI-RJ J-7712</span>
        <a href="mailto:contato@emcasa.com">contato@emcasa.com</a>
        <Link passHref href="/sitemap">
          <a>Mapa do site</a>
        </Link>

        <div className="icons">
          <a
            href="https://www.facebook.com/EmCasa"
            target="_blank"
            className="icon"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>

          <a
            href="https://www.instagram.com/emcasaimoveis/"
            target="_blank"
            className="icon"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>

          <a
            href="https://www.linkedin.com/company/emcasa/"
            target="_blank"
            className="icon"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>

          <a
            href="https://twitter.com/EmCasaTech"
            target="_blank"
            className="icon"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
      </EmCasaContact>
    </Container>
  </Fragment>
)

export default Footer
