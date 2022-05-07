import * as api from '../../api';

export const getWishlists = async (dispatch) => {
  try {
    const { data } = await api.fetchWishlists();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createWishlist = (wishlist) => async (dispatch) => {
  try {
    const { data } = await api.createWishlist(wishlist);
    localStorage.setItem("addWishlist", JSON.stringify(data));
    dispatch({ type: 'CREATE', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteWishlist = (id) => async (dispatch) => {
  try {
    await api.deleteWishlist(id);
    dispatch({ type: 'DELETE', payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

