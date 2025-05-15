import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "axios";
import { api } from "../../Api";
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Modal,
  Box,
} from "@mui/material";

const CrudModal = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  width: "400px",
  zIndex: "1000",
  "& .MuiTextField-root": {
    margin: "8px",
    width: "calc(50% - 16px)",
  },
  "& .MuiButton-root": {
    margin: "8px",
  },
});

const convertToDateInputFormat = (dateStr) => {
  if (!dateStr || dateStr === "N/A") return ""; // Handle empty or "N/A" cases
  const [day, month, year] = dateStr.split("-").map(Number);
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`; // Format for input type="date"
};

const EditUser = ({ editData, handleClose, getOnlineTestDataApi, isEditModalOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    dob: "",
    mobNo: "",
    gender: "",
    role: "",
    designation: "",
  });
  const [disableButton, setDisableButton] = useState(true);
  const [validateNo, setValidateNo] = useState("");
  useEffect(() => {
    console.log("editData", editData);
    if (editData) {
      if (editData.role == "TUTOR") {
        setFormData({
          name: editData?.name,
          email: editData?.email,
          dob: editData?.dob,
          mobNo: editData?.mobNo,
          gender: editData?.gender,
          role: editData?.role,
          designation: editData?.designation,
        });
      } else {
        setFormData({
          name: editData?.name,
          email: editData?.email,
          address: editData?.address,
          dob: editData?.dob,
          mobNo: editData?.mobNo,
          gender: editData?.gender,
          role: editData?.role,
          designation: editData?.designation,
        });
      }
    }
  }, [editData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // setFormData({
    //   ...formData,
    //   [name]: type === "checkbox" ? checked : value,
    // });
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      if (editData.mobNo == "" || formData.mobNo == "") {
        setValidateNo("");
        setDisableButton(true);
      } else if (formData.mobNo.length !== 10) {
        setDisableButton(true);
        setValidateNo("Enter valid 10 digit phone number");
      } else {
        setValidateNo("");
        setDisableButton(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler); // Clear timeout if the user types again before 500ms
    };
  }, [formData.mobNo || editData?.mobNo]); // Only re-run effect if searchTerm changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        // dob: formData.dob,
        mobNo: formData.mobNo,
        gender: formData.gender,
        role: formData.role,
        designation: formData.designation,
        // status: formData.status,
      };
      if (formData.role == "TUTOR") {
        const response = await axios.put(
          `${api}/newskill/editTutor?tutorId=${editData.tutorId}`,
          payload
        );
        console.log("Form submitted successfully", response.data);
        alert("Data Updated");
        handleClose();
        getOnlineTestDataApi();
      } else {
        const response = await axios.put(
          `${api}/newskill/updateTrainee?studentId=${editData.studentId}`,
          payload
        );
        console.log("Form submitted successfully", response.data);
        alert("Data Updated");
        handleClose();
        getOnlineTestDataApi();
      }
    } catch (error) {
      console.error("There was an error submitting the form", error);
      alert("Failed to update data. Please try again.");
    }
  };

  return (
    <Modal open={isEditModalOpen}>
      <CrudModal>
        <h4 style={{ marginBottom: "8px" }}>Edit User Details</h4>
        <form onSubmit={handleSubmit}>
          {/* <div style={{ display: "flex", flexWrap: "wrap" }}> */}
          <TextField
            name="Name"
            defaultValue={editData.name}
            onChange={handleChange}
            style={{ width: "100%" }}
            label="Name"
            variant="outlined"
            required
          />
          <TextField
            name="email"
            style={{ width: "100%" }}
            defaultValue={editData.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
            type="email"
            readOnly
          />
          {editData.role !== "TUTOR" ? (
            <TextField
              style={{ width: "100%" }}
              name="address"
              defaultValue={editData.address}
              onChange={handleChange}
              label="Address"
              variant="outlined"
              type="text"
              fullWidth
            />
          ) : null}

          {/* <TextField
            name="dob"
            defaultValue={editData.dob}
            onChange={handleChange}
            label=""
            variant="outlined"
            type="date"
          /> */}
          <TextField
            style={{ width: "100%" }}
            name="mobNo"
            defaultValue={editData.mobNo}
            onChange={handleChange}
            label="Mobile No."
            variant="outlined"
            type="number"
          />
          <label style={{ fontSize: "12px", color: "red", marginLeft: "10px" }}>{validateNo}</label>

          <FormControl
            row
            sx={{ display: "flex", flexDirection: "row", ml: 1, alignItems: "center", mb: 1 }}
          >
            <div style={{ fontSize: "16px" }}>Gender:</div>
            <RadioGroup
              name="gender"
              defaultValue={editData.gender}
              onChange={handleChange}
              row
              sx={{ ml: 1 }}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <TextField
            name="role"
            defaultValue={editData.role}
            onChange={handleChange}
            label="Role"
            variant="outlined"
            type="text"
            readOnly
          />
          <TextField
            name="designation"
            defaultValue={editData.designation}
            onChange={handleChange}
            label="Designation"
            variant="outlined"
            type="text"
          />
          {/* </div> */}
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={disableButton}
              sx={{ color: "white !important" }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{ color: "white !important" }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        </form>
      </CrudModal>
    </Modal>
  );
};

EditUser.propTypes = {
  editData: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getOnlineTestDataApi: PropTypes.func.isRequired,
  isEditModalOpen: PropTypes.boolean,
};

export default EditUser;
