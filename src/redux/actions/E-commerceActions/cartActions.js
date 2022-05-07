import * as api from '../../api';

export const getCarts = async (dispatch) => {
  try {
    const { data } = await api.fetchCarts();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createCart = (cart) => async (dispatch) => {
  try {
    const { data } = await api.createCart(cart);
    localStorage.setItem("addCart", JSON.stringify(data));
    dispatch({ type: 'CREATE', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const sendEmail = (mail) => async (dispatch) => {
  try {
    const { data } = await api.sendEmail(mail);
  //   localStorage.setItem("addProduct", JSON.stringify(data));
    dispatch({ type: 'SEND', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCart = (id) => async (dispatch) => {
  try {
    await api.deleteCart(id);
    dispatch({ type: 'DELETE', payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateCart = (id, cart) => async (dispatch) => {
  try {
    const { data } = await api.updateCart(id, cart);
    dispatch({ type: 'UPDATE', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteAllCart = () => async (dispatch) => {
  try {
    const { data } = await api.deleteAllCart();
    dispatch({ type: 'DELETE_ALL', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
