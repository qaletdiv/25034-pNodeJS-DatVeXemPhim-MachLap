import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from './../../api/axiosClient';


export const register = createAsyncThunk(
    "auth/register",
    async ({ name, password, email, phone, confirmPass }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/api/register", {
                name,
                password,
                email,
                phone,
                confirmPass
            });
            console.log("response--re", response);
            return response.data;
        } catch (error) {
            // const message = error.response?.data?.message || error.message;
            const message = error.response?.data?.error[0].msg;
            console.log(message, "message");
            return rejectWithValue(
                message || "Register failed"
            );
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async ({ emailOrPhone, password }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/api/login", {
                emailOrPhone,
                password,
            });
            console.log("response", response);
            const { accessToken, user } = response.data;
            console.log("user", user);

            console.log("accesstoken_", accessToken);


            if (accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken)
            }

            return response.data;
        } catch (error) {
            const message = error.response?.data?.error[0].msg;
            console.log(message, "message");
            return rejectWithValue(
                message || "Login failed"
            );
        }
    }
)

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async (googleToken, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/api/google-login", {
                token: googleToken,
            });

            const { accessToken, user } = response.data;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("currentUser", JSON.stringify(user));
            }

            return { accessToken, user };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Google login failed"
            );
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
})

const authSlices = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: localStorage.getItem("accessToken") || null,
        loading: false,
        error: null,
    },
    reducers: {


    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                // state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Regisser Failed";
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Login Failed";
            })
            // GOOGLE LOGIN
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //log out
            .addCase(logout.fulfilled, (state) => {
                state.accessToken = null;
                state.user = null;
                state.error = null;
                state.loading = false;
            });
    }
})



export default authSlices.reducer

