import { createSlice } from "@reduxjs/toolkit";
import { ActivityPageView } from "../utils/AysUtils";

export const activityViewSlice = createSlice({
    name: "View",
    initialState: { value: ActivityPageView.day },
    reducers: {
        setActivityPageView: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setActivityPageView } = activityViewSlice.actions;

export default activityViewSlice.reducer;