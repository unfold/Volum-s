import React, { Component, PropTypes } from 'react'
import { Animated, PanResponder } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { clamp } from 'lodash'
import * as actions from '../actions'

const Container = styled.View`
  flex-grow: 1;
  align-items: center;
  margin-bottom: 50;
`

const Track = styled.View`
  width: 100;
  flex-grow: 1;
`

const Thumb = styled(Animated.View)`
  align-items: center;
  justify-content: space-between;
`

const Label = styled.View`
  opacity: ${props => (props.dragging ? 1 : 0)};
  align-items: center;
`

const Dot = styled.View`
  width: 10;
  height: 10;
  border-width: 0.5;
  border-color: white;
  border-radius: 5;
  background-color: ${props => (props.dragging ? 'white' : 'transparent')};
`

const Text = styled.Text`
  color: white;
`

class Slider extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    disabled: PropTypes.bool,

    minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,

    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    minimumValue: 0,
    maximumValue: 1,
  }

  constructor(props) {
    super(props)

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !this.props.disabled, // Should we become active when pressed?
      onPanResponderGrant: this.onPress,
      onPanResponderMove: this.onMove,
      onPanResponderRelease: this.onRelease,
      onPanResponderTerminationRequest: () => false, // Should we allow another PanResponder else to take over?
      onPanResponderTerminate: this.onRelease,
    })

    this.value = new Animated.Value(props.value)

    this.state = {
      dragging: false,
      thumbHeight: 80,
      trackHeight: 0,
    }
  }

  componentWillMount() {
    this.valueListenerId = this.value.addListener(event => this.props.onChange(event.value))
  }

  componentWillUnmount() {
    this.value.removeListener(this.valueListenerId)
  }

  onPress = () => {
    this.previousValue = this.props.value
    this.setState({ dragging: true })
  }

  onMove = (event, gestureState) => {
    const { thumbHeight, trackHeight } = this.state
    const { minimumValue, maximumValue } = this.props

    const inputRange = trackHeight - thumbHeight
    const offsetY = this.previousValue * inputRange
    const positionY = offsetY - gestureState.dy
    const nextValue = clamp(positionY / inputRange, minimumValue, maximumValue)

    this.value.setValue(nextValue)
  }

  onRelease = () => {
    this.setState({ dragging: false })
  }

  onTrackLayout = ({ nativeEvent }) => {
    this.setState({ trackHeight: nativeEvent.layout.height })
  }

  render() {
    const { minimumValue, maximumValue, title, value } = this.props
    const { dragging, thumbHeight, trackHeight } = this.state

    const label = Math.round(value * 100)
    const translateY = this.value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [trackHeight - thumbHeight, 0],
      extrapolate: 'clamp',
    })

    const style = {
      height: thumbHeight,
      transform: [{ translateY }],
    }

    return (
      <Track onLayout={this.onTrackLayout} {...this.panResponder.panHandlers}>
        <Thumb style={style}>
          <Label dragging={dragging}>
            <Text>{title}</Text>
            <Text>{label}</Text>
          </Label>
          <Dot dragging={dragging} />
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
  setVolume: volume => dispatch(actions.setVolume(id, volume)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Zone)
