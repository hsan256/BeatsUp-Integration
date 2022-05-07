export default (carts = [], action) => {
  switch (action.type) {
    case 'DELETE':
      return carts.filter((cart) => cart._id !== action.payload);
    case 'FETCH_ALL':
      return action.payload;
    case 'UPDATE':
      return carts.map((cart) => (cart._id === action.payload._id ? action.payload : cart));
    case 'CREATE':
      return [...carts, action.payload];
    case 'DELETE_ALL':
      return action.payload;
      case 'SEND':
        return action.payload;
    default:
      return carts;
  }
};