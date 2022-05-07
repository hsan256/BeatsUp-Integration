import { configureStore } from '@reduxjs/toolkit';
import songReducer from './components/KaraokePlayer/songSlice';
import uploadErrorReducer from './components/KaraokePlayer/uploadErrorSlice';



export default configureStore({
  reducer: {
    song: songReducer,
    uploadError: uploadErrorReducer
  },
});