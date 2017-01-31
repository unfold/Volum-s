import React, { PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'

const Container = styled.View`
  padding-bottom: 15;
  border-color: white;
  border-bottom-width: 0.5;
  margin: 25;
`

const Text = styled.Text`
  color: white;
  font-size: 16;
  font-family: System;
  letter-spacing: 0.12;
  line-height: 20;
`

const Artist = styled(Text)`
  font-weight: 500;
`

const Track = styled(Text)`
  font-weight: 100;
`

const NowPlaying = ({ artist, track }) => (
  <Container>
    <Artist>{artist}</Artist>
    <Track>{track}</Track>
  </Container>
)

NowPlaying.propTypes = {
  artist: PropTypes.string,
  track: PropTypes.string,
}

const mapStateToProps = ({ playing }) => ({
  artist: playing.artist,
  track: playing.track,
})

export default connect(mapStateToProps)(NowPlaying)
