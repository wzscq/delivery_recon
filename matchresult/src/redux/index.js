import { configureStore } from '@reduxjs/toolkit'

import frameReducer from './frameSlice';
import dataReducer from './dataSlice';
import i18nReducer from './i18nSlice';
import customerReducer from './customerSlice';

export default configureStore({
  reducer: {
    frame:frameReducer,
    data:dataReducer,
    customer:customerReducer,
    i18n:i18nReducer
  }
});