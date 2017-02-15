import React, { Component, PropTypes } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import * as actions from '../actions'

const Container = styled.View`
  flex-grow: 0.5;
`

const Overlay = styled.View`
  flex-grow: 1;
  justify-content: flex-end;
  margin: 25;
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
  resizeMode: cover;
`

class NowPlaying extends Component {
  static propTypes = {
    artist: PropTypes.string,
    track: PropTypes.string,
    artworkUrl: PropTypes.string,
    fetchNowPlaying: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.fetchNowPlaying()
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
            <Track>{track}</Track>
            <Artist>{artist}</Artist>
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
