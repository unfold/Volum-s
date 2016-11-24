import React, { PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { keys } from 'lodash'
import Zone from './Zone'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
  },
})

const Zones = ({ zones }) => (
  <View style={styles.container}>
    {zones.map(id => <Zone key={id} id={id} />)}
  </View>
)

Zones.propTypes = {
  zones: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const mapStateToProps = ({ zones }) => ({ zones: keys(zones) })

export default connect(mapStateToProps)(Zones)
