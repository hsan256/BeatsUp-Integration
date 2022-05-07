export default (comments = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload;
    case 'CREATE':
      return [...comments, action.payload];
    default:
      return comments;
    }
  };

