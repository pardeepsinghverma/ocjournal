import { configureStore } from "@reduxjs/toolkit";
import pageSlice from "./pageSlice";
import dataSlice from "./dataSlice"


const store = configureStore({
    reducer: {
        page: pageSlice,
        data: dataSlice,
    },
});

export default store;