import React from 'react'
import { StyleSheet, View } from 'react-native'

import NowPlaying from './NowPlaying'
import Zones from './Zones'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
  },

  nowPlaying: {
    margin: 25,
  },

  zones: {
    flexGrow: 1,
  },
})

const Application = () => (
  <View style={styles.container}>
    <View style={styles.nowPlaying}>
      <NowPlaying />
    </View>
    <View style={styles.zones}>
      <Zones />
    </View>
  </View>
)

export default Application
