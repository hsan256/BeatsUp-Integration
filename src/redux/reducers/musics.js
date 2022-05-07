export default (state = { isLoading: true, musics: [] }, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'END_LOADING':
      return { ...state, isLoading: false };

    case 'FETCH_ALL':
      return { ...state, musics: action.payload };
    case 'FETCH_ALL_BY_ID':
      return { ...state, musics: action.payload };
    case 'CREATE':
      return { ...state, musics: [...state.musics, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        musics: state.musics.map((music) => (music._id === action.payload._id ? action.payload : music)),
      };
    case 'DELETE':
      return { ...state, musics: state.musics.filter((music) => music._id !== action.payload) };
    default:
      return state;
  }
};
