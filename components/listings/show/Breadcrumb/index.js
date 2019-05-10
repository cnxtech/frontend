import Link from 'next/link'
import {
  Wrapper,
  Container,
  Path,
  LinkButton
} from './styles'
import Text from '@emcasa/ui-dom/components/Text'

export default ({paths}) => (
  <Wrapper>  
    <Container>
      {paths.map(({name, href, as}) => (
        <Path key={name}>
          {href ? (
            <Link passHref href={href} as={as}>
              <LinkButton as="a" fontSize="small" color="inherit" fontWeight="normal" inline link="true">{name}</LinkButton>
            </Link>
          ) : (
            <Text fontSize="small" color="inherit" fontWeight="normal" inline>{name}</Text>
          )}
        </Path>
      ))}
    </Container>
  </Wrapper>
)
