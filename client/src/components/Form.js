import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CryptoJS from "crypto-js";
import config from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";
import firebase from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import Preview from "./Preview";
import Spinner from "../utils/Spinner";

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};

const Form = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    registrationID: `TeckStack-${uuidv4()}`,
  });
  const [open, setOpen] = useState(false);
  const [imagePreviewBlob, setImagePreviewBlob] = useState("");

  const defaultValues = {
    registrationType: "",
    ticket: 1,
  };

  const defaultValuesAfterRegistration = {
    registrationType: "",
  };

  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    formState,
    getValues,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    async function checkTokenValidation(token) {
      try {
        const response = await axios.post(
          `${config.URL}/api/form/token/${token}`,
          null
        );
        if (response.status === 201) setLoading(false);
      } catch (error) {
        console.log("ERROR FORM");
      }
    }
    setLoading(true);
    checkTokenValidation(token);
  }, [token]);

  const onSubmit = async (data, e) => {
    // handle image upload
    setLoading(true);
    const IDcardURL = await handleUploadIDCard(
      {
        ...data,
        IDcardURL: new File(
          [...data.IDcardURL],
          `${info.registrationID}.${data.IDcardURL[0].name.split(".")[1]}`,
          {
            type: `image/${data.IDcardURL[0].name.split(".")[1]}`,
          }
        ),
      }.IDcardURL
    );
    const userInfo = {
      ...data,
      registrationType: data.registrationType.value,
      IDcardURL,
      registrationID: info.registrationID,
    };
    // console.log(userInfo);
    // encrypt;
    const encryptedPayload = CryptoJS.AES.encrypt(
      JSON.stringify(userInfo),
      config.SECRET,
      {
        format: CryptoJSAesJson,
      }
    ).toString();
    const response = await axios.post(
      `${config.URL}/api/form/${token}`,
      JSON.parse(encryptedPayload)
    );
    if (response.status === 201) {
      reset(defaultValuesAfterRegistration);
      setLoading(false);
      console.log("SUCCESS");
    } else console.log("ERROR");
  };

  const handlePreviewImage = (e) => {
    setImagePreviewBlob(URL.createObjectURL(e.target.files[0]));
  };

  const handlePreview = async () => {
    const previewData = getValues();
    console.log(previewData);
    setInfo({
      ...info,
      ...previewData,
      registrationType: previewData.registrationType.value,
      IDcardURL: imagePreviewBlob,
    });
  };

  const handleUploadIDCard = async (file) => {
    return new Promise(async (resolve, reject) => {
      let bucketName = "TeckStack";
      let imageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
      await imageRef.put(file).catch((error) => {
        reject();
      });
      const url = await imageRef.getDownloadURL().catch((error) => {
        reject();
      });
      console.log(url);
      resolve(url);
    });
  };

  const options = [
    { value: "self", label: "Self" },
    { value: "group", label: "Group" },
    { value: "corporate", label: "Corporate" },
    { value: "others", label: "Others" },
  ];

  return !loading ? (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        width: "320px",
      }}
    >
      <label htmlFor="fname">First name:</label>
      <input
        type="text"
        placeholder="First name"
        name="fname"
        ref={register({
          required: "First name is required",
          minLength: { value: 2, message: "error message" },
          maxLength: { value: 20, message: "error message" },
        })}
      />
      {errors.fname && errors.fname.message}
      <label htmlFor="lname">Last name:</label>
      <input
        type="text"
        placeholder="Last name"
        name="lname"
        ref={register({
          required: "Last name is required",
          minLength: { value: 2, message: "error message" },
          maxLength: { value: 20, message: "error message" },
        })}
      />
      {errors.lname && errors.lname.message}
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
      <label htmlFor="mobile">Mobile number:</label>
      <input
        type="tel"
        placeholder="Mobile number"
        name="mobile"
        ref={register({
          required: "Mobile number is required",
          minLength: { value: 6, message: "error message" },
          maxLength: { value: 15, message: "error message" },
        })}
      />
      {errors.mobile && errors.mobile.message}

      <label htmlFor="registrationType">Registration type:</label>
      <Controller
        as={<Select />}
        options={options}
        name="registrationType"
        isClearable
        control={control}
        register={register}
        rules={{ required: "Registration type is required" }}
        defaultValue={false}
      />
      {errors.registrationType && errors.registrationType.message}

      <label htmlFor="mobile">No. of Ticket:</label>
      <input
        type="number"
        placeholder="Ticket"
        name="ticket"
        ref={register({
          required: "Ticket is required",
          max: { value: 5, message: "error message" },
          min: { value: 1, message: "error message" },
        })}
      />
      {errors.ticket && errors.ticket.message}
      {/* Check for image  size < 1 mb */}
      <label htmlFor="IDcardURL">IDCard:</label>
      <input
        type="file"
        name="IDcardURL"
        accept="image/*"
        onChange={handlePreviewImage}
        ref={register({
          required: "ID card is required",
        })}
      />
      {errors.IDcardURL && errors.IDcardURL.message}
      <Preview
        handlePreview={handlePreview}
        open={open}
        setOpen={setOpen}
        isDisabled={!formState.isValid}
        info={info}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        detailsPreview={false}
      />
    </form>
  ) : (
    <Spinner />
  );
};

export default Form;
