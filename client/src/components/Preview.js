import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./style.css";

const Preview = ({
  open,
  setOpen,
  isDisabled,
  info,
  handleSubmit,
  onSubmit,
  handlePreview,
  detailsPreview,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onClickCapture={handlePreview}
        disabled={isDisabled}
      >
        Preview Informantion
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        styles={{
          modal: {
            width: "90%",
            animation: `${
              open ? "customEnterAnimation" : "customLeaveAnimation"
            } 300ms`,
          },
        }}
      >
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div style={{ height: "auto" }}>
              <img
                src={info.IDcardURL}
                alt="ID Card"
                width="100%"
                height="auto"
              />
            </div>
            <div>
              <ul>
                <li>Registration No. : {info.registrationID}</li>
                {detailsPreview ? (
                  <li>Name : {info.name} </li>
                ) : (
                  <li>Name : {info.fname + " " + info.lname}</li>
                )}
                <li>Email : {info.email}</li>
                <li>Mobile No: {info.mobile}</li>
                <li>Registration Type : {info.registrationType}</li>
                <li>No. of Tickets: {info.ticket}</li>
              </ul>
            </div>
          </div>
          {detailsPreview ? null : (
            <input
              type="submit"
              disabled={isDisabled}
              onClickCapture={handleSubmit(onSubmit)}
              onClick={() => {
                setOpen(false);
              }}
            />
          )}
          <button type="button" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </>
      </Modal>
    </>
  );
};

export default Preview;
