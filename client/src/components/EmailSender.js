import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import config from "../config";

const EmailSender = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data, e) => {
    e.preventDefault();
    const response = await axios.post(`${config.URL}/api/form/form-link`, data);
    console.log(response);
    if (response.status === 201) {
      e.target.reset();
      console.log("SUCCESS");
    } else console.log("ERROR");
  };
  return (
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
      <input type="submit" />
    </form>
  );
};

export default EmailSender;
