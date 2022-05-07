export default (wishlists = [], action) => {
    switch (action.type) {
      case 'DELETE':
        return wishlists.filter((wishlist) => wishlist._id !== action.payload);
      case 'FETCH_ALL':
        return action.payload;
      case 'CREATE':
        return [...wishlists, action.payload];
      default:
        return wishlists;
    }
  };