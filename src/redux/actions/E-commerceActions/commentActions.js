import * as api from '../../api';

export const getComments = async (dispatch) => {
  try {
    const { data } = await api.fetchComments();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createComment = (comment) => async (dispatch) => {
  try {
    const { data } = await api.createComment(comment);
    dispatch({ type: 'CREATE', payload: data });
  } catch (error) {
    console.log(error);
  }
};