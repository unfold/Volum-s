import React, { Component } from 'react'
import { throttle } from 'lodash'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import HostInput from './HostInput'
import Zone from './Zone'
import { fetchStatus, setActive, setVolume } from '../utils/api'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F5FCFF',
  },

  title: {
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 40,
    fontWeight: 'bold',
  },

  host: {
    height: 40,
    padding: 5,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },
})

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      host: '192.168.1.140',
    }
  }

  render() {
    const { host } = this.state

    const zoneProps = {
      fetchStatus: id => fetchStatus(host, id),
      setActive: (id, active) => setActive(host, id, active),
      setVolume: throttle((id, volume) => setVolume(host, id, volume), 50),
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>VOLUMÖS</Text>

        <HostInput host={host} setHost={value => this.setState({ host: value })} />
        <Zone id="ZONE1" title="Kitchen" {...zoneProps} />
        <Zone id="ZONE2" title="Workspace" {...zoneProps} />
      </View>
    )
  }
}
