import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import softwareReducer from "./softwareSlice";
import websiteReducer from "./websiteSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import downloadReducer from "./downloadSlice";
import reviewReducer from "./reviewSlice";

export default configureStore({
  reducer: {
    categories: categoryReducer,
    software: softwareReducer,
    websites: websiteReducer,
    cart: cartReducer,
    order: orderReducer,
    download: downloadReducer,
    reviews: reviewReducer,
  },
});



