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
    selectedDelivery:[],
    selectedBilling:[]
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData:(state,action) => {
            const {data}=action.payload;
    
            if(data.modelID==='dr_delivery_recon'){
                 state.deliveryData=data;
                 state.selectedDelivery=[];
                 state.deliveryLoaded=true;
            }

            if(data.modelID==='dr_billing_recon'){
                state.billingData=data;
                state.selectedBilling=[];
                state.billingLoaded=true;
            }
        },
        resetData:(state,action)=>{
            state.deliveryLoaded=false;
            state.billingLoaded=false;
            state.selectedDelivery=[];
            state.selectedBilling=[];
        },
        setSelectedDelivery:(state,action)=>{
            console.log('setSelectedDelivery',action.payload);
            state.selectedDelivery=action.payload;
        },
        setSelectedBilling:(state,action)=>{
            state.selectedBilling=action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
    setData,
    resetData,
    setSelectedDelivery,
    setSelectedBilling
} = dataSlice.actions

export default dataSlice.reducer