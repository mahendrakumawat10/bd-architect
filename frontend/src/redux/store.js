import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./reducers/adminSlice";

const store = configureStore({
  reducer: {
    admin: adminSlice,
  },
});


export default store;
