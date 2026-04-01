import { logger } from 'redux-logger/src';
import storage from 'redux-persist/lib/storage';
import { combineReducers, Middleware } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from '@reduxjs/toolkit';
import { DEV_ENV } from '../utils/env';
import userReducer from './userReducer';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { ReactNode } from 'react';

const persistConfig = {
    key: 'root',
    storage,
};

const appReducer = combineReducers({ userReducer });
const persistedReducer = persistReducer(persistConfig, appReducer);

const middlewares: Middleware[] = [];
if (DEV_ENV) {
    middlewares.push(logger);
}

const store = configureStore({
    reducer: persistedReducer,
    devTools: DEV_ENV,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(middlewares),
});
const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const withStore = (Wrapped: React.ComponentType<{ children?: ReactNode }>) => {
    const StoreWrapper = (props: { children?: ReactNode }) => {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Wrapped {...props} />
                </PersistGate>
            </Provider>
        );
    };
    return StoreWrapper;
};

export { store, persistor, withStore };
