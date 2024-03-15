import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  id: string;
  gsm: string;
  roles: string[];
}

export const initIUser = { id: "", gsm: "", roles: [] };

export const userSlice = createSlice({
  name: "User",
  initialState: { value: initIUser },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
