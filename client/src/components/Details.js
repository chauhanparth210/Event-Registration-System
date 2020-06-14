import React, { useState, useEffect } from "react";
import config from "../config";
import axios from "axios";
import authToken from "../utils/SetAuthToken";
import Spinner from "../utils/Spinner";
import "./style.css";
import Preview from "./Preview";

const Details = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectUser, setSelectUser] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(
        `${config.URL}/api/admin/details`,
        authToken()
      );
      setData(response.data);
      setLoading(false);
    };
    setLoading(true);
    fetchDetails();
  }, []);

  function renderTableHeader() {
    if (data.length !== 0) {
      let header = Object.keys(data[0]);
      header.push("Preview");
      return header.map((key, index) => {
        return !(
          key === "createdAt" ||
          key === "registrationID" ||
          key === "IDcardURL"
        ) ? (
          <th key={index}>{key.toUpperCase()}</th>
        ) : null;
      });
    }
  }

  function renderTableData() {
    return data.map((user) => {
      const {
        name,
        email,
        mobile,
        registrationType,
        registrationID,
        ticket,
      } = user;
      return (
        <tr
          key={registrationID}
          onClick={() => handleClick(registrationID)}
          style={{ cursor: "pointer" }}
        >
          <td>{ticket}</td>
          <td>{name}</td>
          <td>{email}</td>
          <td>{mobile}</td>
          <td>{registrationType.toUpperCase()}</td>
          <td>
            <Preview
              open={open}
              setOpen={setOpen}
              info={selectUser}
              detailsPreview={true}
            />
          </td>
        </tr>
      );
    });
  }

  const handleClick = (registrationID) => {
    const selectedUser = data.filter((user) => {
      return user.registrationID === registrationID ? user : null;
    });
    setSelectUser(selectedUser[0]);
  };

  return !loading ? (
    <div>
      <h1 className="title">User Details</h1>
      <table className="user">
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
    </div>
  ) : (
    <Spinner />
  );
};

export default Details;
