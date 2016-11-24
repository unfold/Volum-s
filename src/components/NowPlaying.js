import React, { PropTypes } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  container: {
    borderColor: 'white',
    borderBottomWidth: 0.5,
    paddingBottom: 15,
  },

  text: {
    color: 'white',
    fontFamily: 'System',
    fontSize: 16,
    letterSpacing: 0.12,
    lineHeight: 20,
  },

  artist: {
    fontWeight: '500',
  },

  track: {
    fontWeight: '100',
  },
})

const NowPlaying = ({ artist, track }) => (
  <View style={styles.container}>
    <Text style={[styles.text, styles.artist]}>{artist}</Text>
    <Text style={[styles.text, styles.track]}>{track}</Text>
  </View>
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
