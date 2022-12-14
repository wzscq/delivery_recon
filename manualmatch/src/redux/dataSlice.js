import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    deliveryLoaded:false,
    billingLoaded:false,
    //原始数据
    deliveryData:{
        total:0,
        list:[],
        summarize:{}
    },
    billingData:{
        total:0,
        list:[],
        summarize:{}
    },
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data}=action.payload;
    
            if(data.modelID==='dr_delivery_recon'){
                 state.deliveryData=data;
                 state.deliveryLoaded=true;
            }

            if(data.modelID==='dr_billing_recon'){
                state.billingData=data;
                state.billingLoaded=true;
            }
        },
        resetData:(state,action)=>{
            state.deliveryLoaded=false;
            state.billingLoaded=false;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData,
    resetData
} = dataSlice.actions

export default dataSlice.reducer