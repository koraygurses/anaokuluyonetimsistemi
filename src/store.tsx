import { combineReducers, configureStore } from "@reduxjs/toolkit";
import roleReducer from "./reducers/roleReducer";
import userReducer from "./reducers/userReducer";
import bulletinPageReducer from "./reducers/bulletinPageReducer";
import activityViewReducer from "./reducers/activityViewReducer";

const rootReducer = combineReducers({ role: roleReducer, user: userReducer, activityPageView: activityViewReducer, bulletinRefresh: bulletinPageReducer });

export const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
