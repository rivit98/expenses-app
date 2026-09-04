import { combineReducers, configureStore, type Middleware } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { FLUSH, PAUSE, PERSIST, PURGE, persistReducer, persistStore, REGISTER, REHYDRATE } from 'redux-persist';
import type { WebStorage } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';
import storageImport from 'redux-persist/lib/storage';
import userReducer from './userReducer';

// redux-persist ships CommonJS with no ESM build. Rollup unwrapped its `default`
// export for us; Rolldown (Vite 8) hands back the `{ __esModule, default }`
// namespace instead, so accept either rather than trusting bundler interop.
const storage: WebStorage = (storageImport as WebStorage & { default?: WebStorage }).default ?? storageImport;

const persistConfig = {
    key: 'root',
    storage,
};

const appReducer = combineReducers({ userReducer });
const persistedReducer = persistReducer(persistConfig, appReducer);

const middlewares: Middleware[] = [];
if (import.meta.env.DEV) {
    const { logger } = await import('redux-logger/src');
    middlewares.push(logger);
}

const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.DEV,
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

export { persistor, store, withStore };
