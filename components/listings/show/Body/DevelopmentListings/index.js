import React from 'react'
import {GET_DEVELOPMENT_LISTINGS} from 'graphql/listings/queries'
import {graphql} from 'react-apollo'
import compose from 'recompose/compose'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import Text from '@emcasa/ui-dom/components/Text'
import Icon from '@emcasa/ui-dom/components/Icon'
import Breakpoint, {withBreakpoint} from '@emcasa/ui-dom/components/Breakpoint'
import {groupListings} from 'lib/listings/development'
import Group from './Group'
import {Container, UnitsRow} from './styles'

class DevelopmentListings extends React.PureComponent {
  static defaultProps = {
    listings: []
  }

  state = {
    groups: this.groupListings(),
    expanded: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listings !== this.props.listings)
      this.setState({groups: this.groupListings()})
  }

  groupListings() {
    return new Map(groupListings(this.props.listings))
  }

  expand = () => this.setState({expanded: true})

  collapse = () => this.setState({expanded: false})

  renderRow = (groups) => {
    const {address, breakpoint} = this.props
    const {expanded} = this.state

    return (
      <UnitsRow>
        {groups.map(([group, listings]) => (
          <Group
            {...group}
            expanded={breakpoint === 'desktop' ? expanded : undefined}
            address={address}
            listings={listings}
          />
        ))}
        {Array(3 - groups.length)
          .fill(null)
          .map(() => <div />)}
      </UnitsRow>
    )
  }

  render() {
    const {listings} = this.props
    const {expanded} = this.state
    const groups = Array.from(this.state.groups)
    const rows = Math.ceil(groups.length / 3)

    return (
      <Container>
        <Row mr={2} ml={2} mb={4}>
          <Text inline color="blue">
            {listings.length}
          </Text>
          <Row width={5} />
          <Text inline fontWeight="bold">
            unidades disponíveis
          </Text>
        </Row>
        {Array(rows)
          .fill(null)
          .map((_, i) => this.renderRow(groups.slice(i * 3, (i + 1) * 3), i))}
        <Breakpoint up="desktop">
          <Row flex={1} mt={4} mb={2} justifyContent="center">
            <Button
              height="tall"
              onClick={expanded ? this.collapse : this.expand}
            >
              <Row alignItems="center">
                <Icon
                  name={`chevron-${expanded ? 'up' : 'down'}`}
                  size={14}
                  mr={2}
                />
                <Text inline fontSize="small">
                  Mostrar todas as unidades
                </Text>
              </Row>
            </Button>
          </Row>
        </Breakpoint>
      </Container>
    )
  }
}

export default compose(
  graphql(GET_DEVELOPMENT_LISTINGS, {
    options: ({uuid}) => ({
      variables: {uuid}
    }),
    props: ({data}) =>
      !data || !data.development
        ? {}
        : {
            listings: data.development.listings,
            address: data.development.address
          }
  }),
  withBreakpoint()
)(DevelopmentListings)
