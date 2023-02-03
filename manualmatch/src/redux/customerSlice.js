import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    loaded:false,
    //原始数据
    list:[],
    current:null,
    material:null,
    withReconCustomer:false,
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomerData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list;
            state.loaded=true;
            if(list.length>0&&state.current===null){
              state.current=list[0].id;
            }
        },
        setCurrentCustomer:(state,action) => {
          state.current=action.payload;
        },
        setMaterial:(state,action) => {
          state.material=action.payload;
        },
        setWithReconCustomer:(state,action)=>{
          state.withReconCustomer=action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
  setCustomerData,
  setCurrentCustomer,
  setMaterial,
  setWithReconCustomer
} = customerSlice.actions

export default customerSlice.reducer