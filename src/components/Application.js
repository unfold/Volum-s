import React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'

import NowPlaying from './NowPlaying'
import Setup from './Setup'
import Zones from './Zones'

const Container = styled.View`
  flex-grow: 1;
  background-color: black;
`

export default () => (
  <Container>
    <StatusBar barStyle="dark-content" />
    <NowPlaying />
    <Zones />
    <Setup />
  </Container>
)
