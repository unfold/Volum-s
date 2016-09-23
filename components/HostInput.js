import React, { PropTypes } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  input: {
    height: 40,
    padding: 5,
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },
})

const HostInput = ({ host, setHost }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      onChangeText={value => setHost(value)}
      value={host}
    />
  </View>
)

HostInput.propTypes = {
  host: PropTypes.string,
  setHost: PropTypes.func.isRequired,
}

export default HostInput
