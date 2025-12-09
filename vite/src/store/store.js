import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import clientReducer from './slices/clientSlice.js';
import contactReducer from './slices/contactSlice.js';
import contractReducer from './slices/contractSlice.js';
import statusReducer from './slices/statusSlice.js';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
};

const rootReducer = combineReducers({
  client: clientReducer,
  contact: contactReducer,
  contract: contractReducer,
  status: statusReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
export default store;
