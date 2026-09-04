import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserData } from '../types/api';

export interface UserState {
    id?: number;
    username?: string;
    access?: string;
    refresh?: string;
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {} as UserState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
            return { ...state, ...action.payload };
        },
        removeUser: () => {
            return {};
        },
    },
});

export const { updateUser, removeUser } = userSlice.actions;

export const isLoggedIn = (state: { userReducer: UserState }): boolean =>
    state.userReducer.id !== undefined && state.userReducer.access !== undefined;
export const currentUserData = (state: { userReducer: UserState }): UserState => state.userReducer;

export default userSlice.reducer;
