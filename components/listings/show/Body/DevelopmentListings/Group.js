import React from 'react'
import Link from 'next/link'
import Col from '@emcasa/ui-dom/components/Col'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import Icon from '@emcasa/ui-dom/components/Icon'
import Breakpoint from '@emcasa/ui-dom/components/Breakpoint'
import {getListingPrice, buildSlug} from 'lib/listings'
import {Title, List} from './styles'

const getFloor = (listing) => {
  if (isNaN(listing.floor)) return listing.floor
  else return `${listing.floor}º andar`
}

export default class DevelopmentListingsGroup extends React.PureComponent {
  state = {
    expanded: false
  }

  static getDerivedStateFromProps(props, state) {
    return {
      expanded:
        typeof props.expanded === 'boolean' ? props.expanded : state.expanded
    }
  }

  expand = () => {
    this.setState({expanded: true})
  }

  collapse = () => {
    this.setState({expanded: false})
  }

  render() {
    const {area, rooms, listings, address, ...props} = this.props
    const {expanded} = this.state
    return (
      <Col {...props}>
        <Title>
          {area}m² - {rooms} quartos
        </Title>
        <List>
          {listings.slice(0, expanded ? listings.length : 3).map((listing) => (
            <li>
              <Text inline fontSize="small">
                {getListingPrice(listing)} / {getFloor(listing)}
              </Text>
              <Link
                passHref
                href={`/listings/show?id=${listing.id}`}
                as={buildSlug({address, ...listing})}
              >
                <a>
                  <Button link fontSize="small" color="blue" p={0} m={0}>
                    ver mais detalhes
                  </Button>
                </a>
              </Link>
            </li>
          ))}
        </List>
        {listings.length > 3 && (
          <Breakpoint down="tablet">
            <Row justifyContent="flex-end" m={4}>
              <Button onClick={expanded ? this.collapse : this.expand}>
                <Icon name={`chevron-${expanded ? 'up' : 'down'}`} size={14} />
              </Button>
            </Row>
          </Breakpoint>
        )}
      </Col>
    )
  }
}
