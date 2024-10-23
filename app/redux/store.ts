import { configureStore, applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import persistReducer from "redux-persist/es/persistReducer";
import userSlice from "./reducers/poppingUser";

const reducers = combineReducers({
  poppingUser: userSlice.reducer,
})
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["poppingUser"],
}

const persistedReducer = persistReducer(persistConfig, reducers);

const middleware: (getDefaultMiddleware: any) => any = (getDefaultMiddleware) =>
  // 개발 환경에서만 Redux-Logger를 추가합니다.
  process.env.NODE_ENV !== 'production' ?
    getDefaultMiddleware({ serializableCheck: false }).concat(logger) :
    // 배포 환경에서는 Redux-Logger를 추가하지 않습니다.
    getDefaultMiddleware({ serializableCheck: false });


const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
