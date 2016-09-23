import React, { Component, PropTypes } from 'react'
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

export default class extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fetchStatus: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      volume: 0,
      active: false,
    }
  }

  componentDidMount() {
    const { id, fetchStatus } = this.props

    fetchStatus(id).then(({ volume, active }) => this.setState({ volume, active }))
  }

  setVolume(volume) {
    this.setState({ volume })
    this.props.setVolume(volume)
  }

  setActive(active) {
    this.setState({ active })
    this.props.setActive(active)
  }

  render() {
    const { title } = this.props
    const { volume, active } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title} {active ? '' : '(inactive)'}</Text>
        <Text>Volume: {Math.round(volume * 100)}%</Text>
        <View style={styles.controls}>
          <Slider
            style={styles.slider}
            value={volume}
            onValueChange={value => this.setVolume(value)}
          />
          <Switch
            style={styles.switch}
            value={active}
            onValueChange={value => this.setActive(value)}
          />
        </View>
      </View>
    )
  }
}
