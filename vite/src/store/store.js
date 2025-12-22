import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import clientReducer from './slices/clientSlice.js';
import contactReducer from './slices/contactSlice.js';
import contractReducer from './slices/contractSlice.js';
import statusReducer from './slices/statusSlice.js';
import sourceReducer from './slices/sourceSlice.js';
import userReducer from "./slices/user.Slice.js";
import leadReducer from "./slices/leadSlice.js"

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
  status: statusReducer,
  source: sourceReducer,
  user: userReducer,
  lead: leadReducer
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
