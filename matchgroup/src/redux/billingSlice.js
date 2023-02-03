import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    //原始数据
    list:[],
    loaded:false
}

export const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list===null?[]:list;
            state.loaded=true;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData
} = billingSlice.actions

export default billingSlice.reducer