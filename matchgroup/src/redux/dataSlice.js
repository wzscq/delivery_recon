import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    loaded:false,
    //原始数据
    list:[]
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list;
            state.loaded=true;
        },
        refreshData:(state,action) => {
            state.loaded=false;
        },
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData,
    refreshData
} = dataSlice.actions

export default dataSlice.reducer