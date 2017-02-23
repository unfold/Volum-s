import React, { Component, PropTypes } from 'react'
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg'

import styled from 'styled-components/native'
import { connect } from 'react-redux'
import * as actions from '../actions'

const REFRESH_DELAY = 2500

const OverlayBackground = () => (
  <Svg style={{ flexGrow: 1 }}>
    <Defs>
      <LinearGradient id="gradient" x2="0" y2="100%">
        <Stop offset="0" stopColor="black" stopOpacity="0" />
        <Stop offset="1" stopColor="black" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    <Rect width="100%" height="100%" fill="url(#gradient)" />
  </Svg>
)

const Overlay = styled.View`
  flex-grow: 1;
`

const Container = styled.View`
  flex-grow: 0.5;
`

const OverlayContent = styled.View`
  position: absolute;
  bottom: 25;
  left: 25;
  right: 25;
`

const Text = styled.Text`
  color: white;
  font-family: System;
  letter-spacing: 0.12;
  background-color: transparent;
`

const Track = styled(Text)`
  font-size: 30;
  font-weight: 300;
  line-height: 30;
`

const Artist = styled(Text)`
  font-size: 16;
  font-weight: 200;
  line-height: 16;
`

const Artwork = styled.Image`
  flex-grow: 1;
`

class NowPlaying extends Component {
  static propTypes = {
    artist: PropTypes.string,
    track: PropTypes.string,
    artworkUrl: PropTypes.string,
    fetchNowPlaying: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchNowPlaying } = this.props

    this.timerId = setInterval(fetchNowPlaying, REFRESH_DELAY)

    fetchNowPlaying()
  }

  componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  render() {
    const { artist, track, artworkUrl } = this.props

    if (!artworkUrl) {
      return null
    }

    return (
      <Container>
        <Artwork source={{ uri: artworkUrl }}>
          <Overlay>
            <OverlayBackground />

            <OverlayContent>
              <Track>{track}</Track>
              <Artist>{artist}</Artist>
            </OverlayContent>
          </Overlay>
        </Artwork>
      </Container>
    )
  }
}

const mapStateToProps = ({ playing }) => playing
const mapDispatchToProps = dispatch => ({
  fetchNowPlaying: () => dispatch(actions.fetchNowPlaying()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying)
