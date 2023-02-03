import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    loaded:false,
    //原始数据
    list:[],
    deletedBilling:[],
    addedBilling:[],
    showSelectBilling:false
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list;
            state.addedBilling=[];
            state.deletedBilling=[];
            state.loaded=true;
        },
        refreshData:(state,action) => {
            state.loaded=false;
        },
        setDeletedBilling:(state,action) =>{
            state.deletedBilling=action.payload;
        },
        setAddedBilling:(state,action) =>{
            state.addedBilling=action.payload;
        },
        setShowSelectBilling:(state,action) =>{
            state.showSelectBilling=action.payload;
        },
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData,
    refreshData,
    setDeletedBilling,
    setAddedBilling,
    setShowSelectBilling
} = dataSlice.actions

export default dataSlice.reducer