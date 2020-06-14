export default (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        isAuthenticated: true,
        userProfile: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        userProfile: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
