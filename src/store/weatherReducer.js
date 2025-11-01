export const initialState = {
  cities: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  selectedCity: null,
  unit: localStorage.getItem('unit') || 'C',
  searchQuery: '',
  loading: false,
  error: null,
  lastUpdate: null
};

export function weatherReducer(state, action) {
  switch (action.type) {
    case 'SET_CITIES':
      return { ...state, cities: action.payload };
      
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
      
    case 'REMOVE_FAVORITE':
      const filtered = state.favorites.filter(city => city !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(filtered));
      return { ...state, favorites: filtered };
      
    case 'SELECT_CITY':
      return { ...state, selectedCity: action.payload };
      
    case 'SET_UNIT':
      localStorage.setItem('unit', action.payload);
      return { ...state, unit: action.payload };
      
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_LAST_UPDATE':
      return { ...state, lastUpdate: action.payload };
      
    default:
      return state;
  }
}