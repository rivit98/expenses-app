import { ReactNode } from 'react';
import storage from 'redux-persist/lib/storage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './userReducer';

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

export { store, persistor, withStore };
