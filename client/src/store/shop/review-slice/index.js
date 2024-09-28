import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";


const initialState = {
    isLoading: false,
    reviews: [],
}


export const addReview = createAsyncThunk(
    "review/addReview",
    async (formdata) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
             formdata 
        );
        return response.data;
    }
)

export const getReviews = createAsyncThunk(
    "review/getReviews",
    async (productId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`
        );
        return response.data;
    }
)


const reviewSlice = createSlice({
    name: "reviewSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.data;
            })
            .addCase(getReviews.rejected, (state) => {
                state.isLoading = true;
                state.reviews = [];
            })
    }
})

export default reviewSlice.reducer;