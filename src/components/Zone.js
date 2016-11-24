import React, { Component, PropTypes } from 'react'
import { Animated, PanResponder, Slider, StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
import * as actions from '../actions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
  },

  track: {
    width: 100,
    flexGrow: 1,
    backgroundColor: 'grey',
  },

  thumb: {
    height: 100,
    // backgroundColor: 'yellow',
  },

  dot: {
    width: 10,
    height: 10,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 5,
  },

  text: {
    color: 'white',
  }
})

class Track extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pan: new Animated.ValueXY(),
    }
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ y: this.state.pan.y._value })
        this.state.pan.setValue({ x: 0, y: 0 })
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),

      onPanResponderRelease: (e, { vx, vy }) => {
        this.state.pan.flattenOffset()
      },
    })
  }

  render() {
    const { pan } = this.state

    const style = {
      transform: [{ translateY: pan.y }],
    }

    return (
      <Animated.View style={[styles.thumb, style]} {...this.panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    )
  }
}

const Zone = ({ name, volume }) => (
  <View style={styles.container}>
    <View style={styles.track}>
      <Track style={styles.thumb}>
        <Text style={[styles.text, styles.volume]}>{volume}</Text>
        <Text style={[styles.text, styles.name]}>{name}</Text>
        <View style={styles.dot} />
      </Track>
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

const mapStateToProps = ({ zones }, { id }) => ({ ...zones[id] })
const mapDispatchToProps = (dispatch, { id }) => ({
  setActive: active => dispatch(actions.setActive(id, active)),
  setVolume: throttle(volume => dispatch(actions.setVolume(id, volume)), 250, { leading: false }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Zone)
