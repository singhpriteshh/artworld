import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
    isLoading: false,
    featureImageList: [],
};





export const addFeatureImages = createAsyncThunk(
    "common/addFeatureImages",
    async (image) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/common/features/add`,
            { image }
        );
        return response.data;
    }
);


export const getFeatureImages = createAsyncThunk(
    "common/getFeatureImages",
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/common/features/get`
        );
        return response.data;
    }
);


const commonSlice = createSlice({
    name: "commonSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = action.payload.data;
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            });
    }
});



export default commonSlice.reducer;