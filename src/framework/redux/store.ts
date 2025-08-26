import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer, { ThemeState } from './themeSlice';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * 新增代码用 mobx，不用redux
 */

// Define the state shape
interface RootState {
  theme: ThemeState;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
});

// Persist config with RootState
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Type for RootState
export type { RootState };
