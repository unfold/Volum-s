import React from 'react'
import styled from 'styled-components/native'

import NowPlaying from './NowPlaying'
import Zones from './Zones'

const Container = styled.View`
  flex-grow: 1;
  background-color: black;
`

const Application = () => (
  <Container>
    <NowPlaying />
    <Zones />
  </Container>
)

export default Application
