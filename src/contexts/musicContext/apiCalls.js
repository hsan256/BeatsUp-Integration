import axios from 'axios';
import { getMusicsFailure, getMusicsStart, getMusicsSuccess } from './MusicActions';

// const SECRET_KEY = 'beatsup ';
// const token = JSON.parse(localStorage.getItem('user')).accessToken;

export const getMusics = async (dispatch) => {
  dispatch(getMusicsStart());
  try {
    const res = await axios.get("https://beatsup-project.herokuapp.com/api/musics");
    dispatch(getMusicsSuccess(res.data));
  } catch (err) {
    dispatch(getMusicsFailure());
  }
};