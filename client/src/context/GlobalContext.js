import React, { createContext, useReducer } from "react";
import Reducer from "./Reducer";
import config from "../config";
import axios from "axios";

const initialState = {
  userProfile: null,
  isAuthenticated: false,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  async function login({ email, password }, history, pathname) {
    return new Promise(async (resolve, reject) => {
      const response = await axios.post(`${config.URL}/api/user/login-admin`, {
        email,
        password,
      });
      if (response.status === 201) {
        localStorage.setItem("TECHSTACK_TOKEN", `${response.data.token}`);
        console.log("LOGIN_SUCCESS");
        dispatch({
          type: "LOGIN_USER",
          payload: {
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          },
        });
        history.replace(pathname);
        resolve(true);
      } else {
        console.log("LOGIN_ERROR");
      }
    });
  }

  function logout() {
    localStorage.removeItem("TECHSTACK_TOKEN");
    dispatch({
      type: "LOGOUT_USER",
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        user: state,
        login,
        logout,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
