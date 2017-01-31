import React, { Component, PropTypes } from 'react'
import { Animated, PanResponder } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
import * as actions from '../actions'

const Container = styled.View`
  flex: 1 1 auto;
  align-items: center;
`

const Track = styled.View`
  width: 100;
  flex-grow: 1;
  background-color: grey;
`

const Thumb = styled.View`
  height: 100;
  background-color: yellow;
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

class Slider extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    const y = new Animated.Value(props.value)
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        y.setOffset(y._value)
        y.setValue(0)
      },

      // onPanResponderMove: Animated.event(null, [{ dy: y }])
      onPanResponderMove: (event, gestureState) => {
        y.setValue(y._value + gestureState.dy)
      },

      onPanResponderRelease: () => {
        y.flattenOffset()
      },
    })

    this.state = {
      y,
      panResponder,
    }
  }

  render() {
    const { title, value } = this.props
    const { panResponder, y } = this.state
    const style = {
      transform: [{ translateY: y }],
    }

    return (
      <Track>
        <Thumb style={style} {...panResponder.panHandlers}>
          <Text>{title}</Text>
          <Text>{value}</Text>
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
  setActive: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
}

const mapStateToProps = ({ zones }, { id }) => ({ ...zones[id] })
const mapDispatchToProps = (dispatch, { id }) => ({
  setActive: active => dispatch(actions.setActive(id, active)),
  setVolume: throttle(volume => dispatch(actions.setVolume(id, volume)), 250, { leading: false }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Zone)
