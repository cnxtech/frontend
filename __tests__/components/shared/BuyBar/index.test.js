import React from 'react'
import BuyBar from 'components/shared/BuyBar'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import theme from 'config/theme'
import {ThemeProvider} from 'styled-components'
import {MockedProvider} from 'react-apollo/test-utils'

describe('<BuyBar/>', () => {
  it('should render component', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <MockedProvider>
          <BuyBar
            user={{authenticated: false}}
          />
        </MockedProvider>
      </ThemeProvider>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
