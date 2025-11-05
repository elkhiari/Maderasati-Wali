import { configureStore, createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { apiSlice } from "./apiSlices";

// Import reactotron safely
let reactotron = undefined;
try {
  reactotron = require("@/config/ReactotronConfig").default;
} catch (error) {
  console.warn("Failed to load Reactotron:", error);
}

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["user", "hasOnboarded"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    rootReducer: createSlice({
      name: "rootReducer",
      initialState: "REDUX CONFIGURED CORRECTLY",
      reducers: {},
    }).reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: persistedUserReducer,
    ...injectedReducers,
  });
  return rootReducer;
}

let enhancers: any[] = [];
if (__DEV__ && reactotron && typeof reactotron.createEnhancer === "function") {
  try {
    const reactotronEnhancer = reactotron.createEnhancer();
    if (reactotronEnhancer) {
      enhancers = [reactotronEnhancer];
    }
  } catch (error) {
    console.warn("Failed to create Reactotron enhancer:", error);
  }
}

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "chatMessages/startMessageUpload",
          "chatMessages/endMessageUpload",
        ],
        ignoredPaths: ["chatMessages.messages"],
      },
    }).concat(apiSlice.middleware),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers),
  devTools: !__DEV__,
});

export const persistor = persistStore(store);

if (__DEV__ && reactotron && typeof reactotron.setReduxStore === "function") {
  try {
    reactotron.setReduxStore(store);
  } catch (error) {
    console.warn("Failed to connect Reactotron to Redux:", error);
  }
}

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
