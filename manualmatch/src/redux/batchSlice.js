import { createSlice } from '@reduxjs/toolkit';
// Define the initial state using that type
const initialState = {
    loaded:false,
    //原始数据
    list:[],
    current:null
}

export const batchSlice = createSlice({
    name: 'batch',
    initialState,
    reducers: {
        setBatchData:(state,action) => {
            const {data:{list}}=action.payload;
            state.list=list;
            state.loaded=true;
            if(list.length>0&&state.current===null){
              state.current=list[0].id;
          }
        },
        setCurrentBatch:(state,action) => {
          state.current=action.payload;
        },
        resetBatch:(state,action)=>{
          state.loaded=false;
          state.list=[];
          state.current=null;
        }
    }
});

// Action creators are generated for each case reducer function
export const { 
  setBatchData,
  setCurrentBatch,
  resetBatch
} = batchSlice.actions

export default batchSlice.reducer