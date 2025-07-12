import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice'
import blogReducer from './blogSlice'
import purohitReducer from './purohitSlice'
import serviceReducer from './serviceSlice'
import dailyRoutineReducer from './dailyRoutineSlice'
import appointmentReducer from './appointmentSlice'
import leadReducer from './leadSlice'
import productReducer from './productSlice'
import userReducer from './userSlice'
import homeReducer from './homeSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  purohits: purohitReducer,
  services: serviceReducer,
  dailyRoutines: dailyRoutineReducer,
  appointments: appointmentReducer,
  leads: leadReducer,
  products: productReducer,
  users: userReducer,
  home: homeReducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 