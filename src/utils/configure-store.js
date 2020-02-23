import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import createReducer from './create-reducer';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  const middlewares = [sagaMiddleware];

  const enhancers = [applyMiddleware(...middlewares)];

  const composeEnhancers =
    process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          shouldHotReload: false,
        })
      : compose;

  const persistConfig = {
    key: 'ftp_test',
    storage,
    whitelist: ['global', 'showcases'],
  }

  const persistedReducer = persistReducer(persistConfig, createReducer())

  const store = createStore(persistedReducer, initialState, composeEnhancers(...enhancers));

  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {};
  store.injectedSagas = {};

  store.runSaga(routinePromiseWatcherSaga);

  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./create-reducer', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
