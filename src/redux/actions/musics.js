import * as api from '../api';

export const getMusics = async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    
    const { data } = await api.fetchMusics();
    dispatch({ type: 'FETCH_ALL', payload: data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.log(error);
  }
};

export const getMusicsById = async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    
    const { data } = await api.fetchMusicsById();
    dispatch({ type: 'FETCH_ALL_BY_ID', payload: data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.log(error);
  }
};

export const createMusic = (music) => async (dispatch) => {
  try {
    const { data } = await api.createMusic(music);

    dispatch({ type: 'CREATE', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateMusic = (id, music) => async (dispatch) => {
  try {
    const { data } = await api.updateMusic(id, music);

    dispatch({ type: 'UPDATE', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMusic = (id) => async (dispatch) => {
  try {
    await api.deleteMusic(id);

    dispatch({ type: 'DELETE', payload: id });
  } catch (error) {
    console.log(error.message);
  }
};