import { createSlice } from "@reduxjs/toolkit";

export const bulletinPageSlice = createSlice({
    name: "bulletinRefresher",
    initialState: { value: 0 },
    reducers: {
        refreshBulletinPage: (state) => {
            state.value = state.value + 1;
        }
    }
})

export const { refreshBulletinPage } = bulletinPageSlice.actions;

export default bulletinPageSlice.reducer;