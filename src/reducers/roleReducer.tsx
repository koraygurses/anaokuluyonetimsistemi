import { createSlice } from "@reduxjs/toolkit";
import { RoleEnum } from "../utils/enum/RoleEnum";

export const roleSlice = createSlice({
    name: "Role",
    initialState: { value: RoleEnum.instructor },
    reducers: {
        setRole: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { setRole } = roleSlice.actions;

export default roleSlice.reducer;