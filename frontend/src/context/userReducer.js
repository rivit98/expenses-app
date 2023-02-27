import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        updateUser: (state, action) => {
            return { ...state, ...action.payload };
        },
        removeUser: () => {
            return {};
        },
    },
});

export const { updateUser, removeUser } = userSlice.actions;

export const isLoggedIn = (state) => state.userReducer.id !== undefined;
export const currentUserData = (state) => state.userReducer;

export default userSlice.reducer;
