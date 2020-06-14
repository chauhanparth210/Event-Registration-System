import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Spinner = () => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "0",
        left: "0",
        background: "#e9eef2",
        height: "100vh",
        width: "100%",
      }}
    >
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={80}
        width={80}
      />
    </div>
  );
};

export default Spinner;
