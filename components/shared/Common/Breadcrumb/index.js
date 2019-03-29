import Link from 'next/link'
import Container, {
  Path,
  BreadcrumbText
} from './styles'

export default ({paths}) => (
  <Container>
    {paths.map(({name, href, as}) => (
      <Path key={name}>
        {href ? (
          <Link href={href} as={as}>
            <BreadcrumbText fontSize="small" color="grey" fontWeight="500" inline link="true">{name}</BreadcrumbText>
          </Link>
        ) : (
          <BreadcrumbText fontSize="small" color="grey" fontWeight="500" inline>{name}</BreadcrumbText>
        )}
      </Path>
    ))}
  </Container>
)
