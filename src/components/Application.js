import React from 'react'
import { Platform, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import NowPlaying from './NowPlaying'
import Setup from './Setup'
import Zones from './Zones'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

const Container = styled.View`
  flex-grow: 1;
  background-color: black;
`

const StatusBarContainer = styled.View`
  height: ${STATUSBAR_HEIGHT};
  background-color: black;
`

export default () => (
  <Container>
    <StatusBarContainer>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
    </StatusBarContainer>

    <NowPlaying />
    <Zones />
    <Setup />
  </Container>
)
