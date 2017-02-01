import React, { Component, PropTypes } from 'react'
import { Animated, PanResponder } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { clamp, throttle } from 'lodash'

const Container = styled.View`
  flex-grow: 1;
  align-items: center;
  margin-bottom: 50;
`

const Track = styled.View`
  width: 100;
  flex-grow: 1;
  background-color: grey;
`

const Thumb = styled(Animated.View)`
  height: 100;
  border-width: 1;
  border-color: yellow;
`

const Dot = styled.View`
  width: 10;
  height: 10;
  border-width: 0.5;
  border-color: white;
  border-radius: 5;
`

const Text = styled.Text`
  color: white;
`

const getValue = animatedValue => animatedValue.__getValue() // eslint-disable-line no-underscore-dangle

class Slider extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    disabled: PropTypes.bool,

    minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,

    onChange: PropTypes.func,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
  }

  static defaultProps = {
    minimumValue: 0,
    maximumValue: 1,
  }

  constructor(props) {
    super(props)

    this.value = new Animated.Value(props.value)
    this.value.addListener(props.onChange)

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.props.disabled, // Should we become active when pressed?
      onPanResponderGrant: this.onPress,
      onPanResponderMove: this.onMove,
      onPanResponderRelease: this.onRelease,
      onPanResponderTerminationRequest: () => false, // Should we allow another PanResponder else to take over?
      onPanResponderTerminate: this.onRelease,
    })

    this.state = {
      value: new Animated.Value(props.value),
      thumbHeight: 100,
      trackHeight: 0,
    }
  }

  onPress = () => {
    const { value } = this.state

    value.setOffset(getValue(value))
    value.setValue(0)

    // onPress(value.__getValue())
  }

  onMove = (event, { dy }) => {
    const { thumbHeight, trackHeight, value } = this.state
    const { minimumValue, maximumValue } = this.props
    const nextValue = clamp((dy / (trackHeight - thumbHeight)) - value._offset, minimumValue, maximumValue)

    value.setValue(nextValue)

    this.setState({ value })

    // onChange(nextValue)
  }

  onRelease = () => {
    const { value } = this.state

    value.flattenOffset()

    // onRelease(value.__getValue())
  }

  onTrackLayout = ({ nativeEvent }) => {
    this.setState({ trackHeight: nativeEvent.layout.height })
  }

  render() {
    const { minimumValue, maximumValue, title } = this.props
    const { thumbHeight, trackHeight, value } = this.state

    const label = Math.round(getValue(value) * 100)
    const translateY = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, trackHeight - thumbHeight],
      extrapolate: 'clamp',
    })

    const style = {
      transform: [{ translateY }],
    }

    return (
      <Track onLayout={this.onTrackLayout} {...this.panResponder.panHandlers}>
        <Thumb style={style}>
          <Text>{title}</Text>
          <Text>{label}</Text>
          <Dot />
        </Thumb>
      </Track>
    )
  }
}

const Zone = ({ active, name, volume, setVolume }) => (
  <Container>
    <Slider
      active={active}
      title={name}
      value={volume}
      onChange={setVolume}
    />
  </Container>
)

Zone.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  // setActive: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
}

const mapStateToProps = ({ zones }, { id }) => ({ ...zones[id] })
const mapDispatchToProps = (dispatch, { id }) => ({
  setActive: active => dispatch(actions.setActive(id, active)),
  setVolume: throttle(volume => dispatch(actions.setVolume(id, volume)), 250, { leading: false }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Zone)
