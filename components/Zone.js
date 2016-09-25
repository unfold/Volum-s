import React, { PropTypes } from 'react'
import {
  Slider,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  controls: {
    flexDirection: 'row',
  },

  slider: {
    flex: 1,
    marginRight: 10,
  },

  switch: {
    flex: 0,
  },
})

const Zone = ({ name, active, volume, setActive, setVolume }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{name} {active ? '' : '(inactive)'}</Text>
    <Text>Volume: {Math.round(volume * 100)}%</Text>
    <View style={styles.controls}>
      <Slider
        style={styles.slider}
        value={volume}
        onValueChange={setVolume}
      />
      <Switch
        style={styles.switch}
        value={active}
        onValueChange={setActive}
      />
    </View>
  </View>
)

Zone.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
}

export default Zone
