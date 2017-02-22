import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const composeEnhancers = __DEV__ ? require('remote-redux-devtools').composeWithDevTools : compose // eslint-disable-line import/newline-after-import, import/no-extraneous-dependencies
const enhancer = composeEnhancers(applyMiddleware(thunk))

export default () => {
  const store = createStore(reducers, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
    })
  }

  return store
}
