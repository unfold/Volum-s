import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const enhancer = composeWithDevTools(applyMiddleware(thunk))

export default () => {
  const store = createStore(reducers, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
    })
  }

  return store
}
