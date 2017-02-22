import React from 'react'
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
    <NowPlaying />
    <Zones />
    <Setup />
  </Container>
)
