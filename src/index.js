import React from 'react'
import { Provider } from 'react-redux'
import createStore from './store'

import Application from './components/Application'

const store = createStore()

export default () => (
  <Provider store={store}>
    <Application />
  </Provider>
)
