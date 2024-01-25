import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {thunk}  from "redux-thunk";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import app from "./slices/app";
import test from "./slices/test"
import persistStore from "redux-persist/es/persistStore";


const testPersistConfig = {
  key: "root",
  storage,
  whitelist: ["test"],
};



const rootReducer = combineReducers({
  app,
  test,
});
const persistedTestReducer = persistReducer(testPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedTestReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});

export const persistor = persistStore(store);
export default store;
