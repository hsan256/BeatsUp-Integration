import * as api from '../api';

export const login = (formData) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);

    dispatch({ type: 'START_LOADING' });

    dispatch({ type: 'AUTH', data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.log(error);
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    const { data } = await api.register(formData);
    
    dispatch({ type: 'START_LOADING' });

    dispatch({ type: 'AUTH', data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.log(error);
  }
};