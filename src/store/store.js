import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import pageSlice from "./pageSlice";
import dataSlice from "./dataSlice";
import { combineReducers } from "redux";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["data"], // Only persist the `data` slice
};

const rootReducer = combineReducers({
    page: pageSlice,
    data: dataSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
