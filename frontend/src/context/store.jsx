import { logger } from 'redux-logger/src';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '@reduxjs/toolkit';
import { DEV_ENV } from '../utils/env';
import userReducer from './userReducer';

const persistConfig = {
    key: 'root',
    storage,
};

const appReducer = combineReducers({ userReducer });
const persistedReducer = persistReducer(persistConfig, appReducer);

const middlewares = [];
if (DEV_ENV) {
    middlewares.push(logger);
}

const store = configureStore({
    reducer: persistedReducer,
    devTools: DEV_ENV,
    middleware: middlewares,
});
const persistor = persistStore(store);

const withStore = (Wrapped) => (props) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Wrapped {...props} />
            </PersistGate>
        </Provider>
    );
};

export { store, persistor, withStore };
