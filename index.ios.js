import React, { Component } from 'react'
import { throttle } from 'lodash'
import {
  AppRegistry,
  StyleSheet,
  Slider,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native'

class ZoneController extends Component {
  constructor(props) {
    super(props)

    this.state = {
      volume: 0,
      mute: false,
    }
  }

  componentDidMount() {
    const { id, getZone } = this.props

    getZone(id, ({ volume, zone }) => this.setState({ volume, zone }))
  }

  setVolume(volume) {
    this.setState({ volume })
    this.props.setVolume(volume)
  }

  setMuted(muted) {
    this.setState({ muted })
    this.props.setMuted(muted)
  }

  render() {
    const { id, title, setVolume, setMuted } = this.props
    const { volume, muted } = this.state

    return (
      <View style={styles.zone}>
        <Text style={styles.zoneTitle}>{title}</Text>
        <Text>Volume: {Math.round(volume * 100)}% {muted ? '(muted)' : ''}</Text>
        <View style={styles.controls}>
          <Slider style={styles.slider} value={volume} onValueChange={value => this.setVolume(value)} />
          <Switch style={styles.switch} value={muted} onValueChange={value => this.setMuted(value)} />
        </View>
      </View>
    )
  }
}

class Volumos extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ip: '192.168.1.140'
    }
  }

  getZone(id) {
    console.log('Fetching zone:', id)
  }

  setVolume(volume) {
    console.log('Setting volume to:', volume)
  }

  setMuted(muted) {
    console.log('Setting muted to:', muted)
  }

  render() {
    const zoneProps = {
      getZone: id => this.getZone(id),
      setVolume: throttle((id, volume) => this.setVolume(id, volume), 50),
      setMuted: (id, muted) => this.setVolume(id, muted)
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>VOLUMÖS</Text>

        <TextInput
          style={styles.ip}
          onChangeText={ip => this.setState({ ip })}
          value={this.state.ip}
        />

        <ZoneController id={0} title="Kitchen" {...zoneProps} />
        <ZoneController id={1} title="Workspace" {...zoneProps} />
      </View>
    )
  }
}

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

  ip: {
    height: 40,
    padding: 5,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },

  zone: {
    marginBottom: 10,
  },

  zoneTitle: {
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
  }
})

AppRegistry.registerComponent('Volumos', () => Volumos)
