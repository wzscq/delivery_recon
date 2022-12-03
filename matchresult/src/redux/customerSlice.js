import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    loaded:false,
    //原始数据
    list:[],
    current:null
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomerData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list;
            state.loaded=true;
            if(list.length>0){
              state.current=list[0].id;
          }
        },
        setCurrentCustomer:(state,action) => {
          state.current=action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
  setCustomerData,
  setCurrentCustomer
} = customerSlice.actions

export default customerSlice.reducer