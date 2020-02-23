import React from 'react';

import { Provider } from 'react-redux';

import Head from 'next/head';
import App from 'next/app';

import withReduxStore from 'utils/with-redux-store';
import { appWithTranslation } from 'utils/with-i18next';

import 'typeface-metropolis';
import '@typefaces-pack/typeface-inter';

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

class Srr extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    const persistor = persistStore(reduxStore)

    return (
      <React.Fragment>
        <Head>
          <title>React Next Boilerplate</title>
        </Head>

        <Provider store={reduxStore}>
          <PersistGate
            loading={<Component {...pageProps} />}
            persistor={persistor}
          >
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
      </React.Fragment>
    );
  }
}

export default appWithTranslation(withReduxStore(Srr));
