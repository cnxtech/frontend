import styled from 'styled-components'
import theme from '@emcasa/ui'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'

const Title = styled(Text)`
  margin: 0 ${theme.space[4]}px ${theme.space[3]}px;
  color: ${theme.colors.grey};
  strong {
     font-weight: ${theme.fontWeights[2]};
  }
`

const Container = styled(Row)`
  justify-content: space-between;
  margin-top: ${theme.space[3]}px;
`

const Loading = styled.div`
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export {Container, Loading, Title}
