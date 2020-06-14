import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "../context/GlobalContext";
import { withRouter } from "react-router-dom";
import Spinner from "../utils/Spinner";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm();
  const { login } = useContext(GlobalContext);
  const onSubmit = async (data, e) => {
    let { referer } = props.location.state || {
      referer: {
        pathname: "/",
      },
    };
    setLoading(true);
    await login(data, props.history, referer.pathname);
    reset();
  };
  return !loading ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "320px",
      }}
    >
      <label htmlFor="email">Email:</label>
      <input
        name="email"
        placeholder="Email address"
        ref={register({
          required: "Email address is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address",
          },
        })}
      />
      {errors.email && errors.email.message}
      <label htmlFor="password">Passowrd:</label>
      <input
        name="password"
        type="password"
        placeholder="Passowrd"
        ref={register({
          required: "Password  is required",
          minLength: {
            value: 6,
            message: "Paaword is too short",
          },
        })}
      />
      {errors.password && errors.password.message}
      <input type="submit" />
    </form>
  ) : (
    <Spinner />
  );
};

export default withRouter(Login);
