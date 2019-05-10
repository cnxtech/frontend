import styled from 'styled-components'
import theme from '@emcasa/ui'
import {ROW_HEIGHT as FILTER_ROW_HEIGHT} from '@emcasa/ui-dom/components/Filters/constants'
import {MAX_HEADER_HEIGHT} from 'components/shared/Shell/Header/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import {HEADER_SEARCH_HEIGHT} from 'constants/dimensions'

const MAP_OFFSET = (props) => FILTER_ROW_HEIGHT(props) + MAX_HEADER_HEIGHT
const MIN_WIDTH_FOR_MAP_RENDER = 1279
const MAP_WIDTH_PERCENT = 30

const shouldShowMap = () => {
  if (process.browser && window) {
    return window.innerWidth >= MIN_WIDTH_FOR_MAP_RENDER
  }
  return false
}

const Title = styled(Text)`
  margin: 0 ${theme.space[4]}px ${theme.space[3]}px;
`

const Container = styled(Row)`
  justify-content: space-between;
  margin-top: ${HEADER_SEARCH_HEIGHT + theme.space[3]}px;
`

const MapContainer = styled.div`
  position: sticky;
  top: ${MAP_OFFSET}px;
  margin-right: ${theme.space[4]}px;
  overflow: hidden;
  box-sizing: border-box;
  background: white;
  border-radius: 4px;
  min-width: ${MAP_WIDTH_PERCENT}%;
  height: calc(100vh - ${MAP_OFFSET}px - ${theme.space[2]}px);
  @media screen and (max-width: ${MIN_WIDTH_FOR_MAP_RENDER - 1}px) {
    display: none;
  }
`

const Loading = styled.div`
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export {
  MIN_WIDTH_FOR_MAP_RENDER,
  MAP_WIDTH_PERCENT,
  shouldShowMap,
  Container,
  MapContainer,
  Loading,
  Title
}
