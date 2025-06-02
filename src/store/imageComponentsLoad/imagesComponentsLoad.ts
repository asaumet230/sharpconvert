import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IImagesLoad {
    isImagesLoad: boolean;
}

const initialState: IImagesLoad = {
    isImagesLoad: false,
}

export const imagesComponentsLoad = createSlice({
  name: 'imagesComponentsLoad',
  initialState,
  reducers: {
    isImagesLoad( state, action:PayloadAction<boolean> ) {
        state.isImagesLoad = action.payload;
    }
  }
});

export const { isImagesLoad } = imagesComponentsLoad.actions

export default imagesComponentsLoad.reducer
