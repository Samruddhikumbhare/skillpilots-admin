import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { api } from "../../Api";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";

const CrudModal = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#dfe3eb",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  width: "400px",
  zIndex: "1000",
  "& .MuiTextField-root": {
    margin: "8px",
    width: "100%",
  },
  "& .MuiButton-root": {
    margin: "8px",
  },
});

const AddbannerData = ({ selectedRowId, handleClose }) => {
  const [tutors, setTutors] = useState([]); // State to hold tutor data
  const [tutorId, setTutorId] = useState(""); // State for selected tutor ID
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseTitle: "",
    courseDesc: "",
    whatYouLearn: "",
    techYouMasters: "",
    courseProjects: [
      { icon: "", projectTitle: "", projectDesc: "" },
      { icon: "", projectTitle: "", projectDesc: "" },
    ],
    courseJourney: {
      phaseITitle: "",
      phaseIDesc1: "",
      phaseIITitle: "",
      phaseIIDesc2: "",
      phaseIIITitle: "",
      phaseIIIDesc3: "",
      phaseIVTitle: "",
      phaseIVDesc4: "",
    },
    programOutcomes: "",
  });

  useEffect(() => {
    if (selectedRowId) {
      fetchCourseData(selectedRowId); // Fetch course data
    }
    getTutors(); // Fetch tutors when the component mounts
  }, [selectedRowId]);

  const fetchCourseData = async (id) => {
    try {
      const response = await axios.get(api + `/newskill/getCourse/${id}`);
      setCourseData(response.data); // Set fetched course data
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTutorChange = (e) => {
    setTutorId(e.target.value); // Set selected tutor ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        api + `/newskill/saveCourse?infoCourse=${selectedRowId}&tutorId=${tutorId}`,
        courseData
      );
      handleClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error saving course data:", error);
    }
  };

  const getTutors = async () => {
    try {
      const response = await axios.get(api + "/newskill/getAllTutor");
      setTutors(response.data.tutors); // Set fetched tutor data
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  return (
    <CrudModal>
      <div>
        <h3>Add Data</h3>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Name"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Title"
                name="courseTitle"
                value={courseData.courseTitle}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Description"
                name="courseDesc"
                value={courseData.courseDesc}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="What You Learn"
                name="whatYouLearn"
                value={courseData.whatYouLearn}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tech You Master"
                name="techYouMasters"
                value={courseData.techYouMasters}
                onChange={handleChange}
                required
              />
            </Grid>
            {courseData.courseProjects.map((project, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Project ${index + 1} Icon`}
                    name={`projectIcon${index}`}
                    value={project.icon}
                    onChange={(e) => {
                      setCourseData((prev) => {
                        const updatedProjects = [...prev.courseProjects];
                        updatedProjects[index].icon = e.target.value;
                        return { ...prev, courseProjects: updatedProjects };
                      });
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Project ${index + 1} Title`}
                    name={`projectTitle${index}`}
                    value={project.projectTitle}
                    onChange={(e) => {
                      setCourseData((prev) => {
                        const updatedProjects = [...prev.courseProjects];
                        updatedProjects[index].projectTitle = e.target.value;
                        return { ...prev, courseProjects: updatedProjects };
                      });
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Project ${index + 1} Description`}
                    name={`projectDesc${index}`}
                    value={project.projectDesc}
                    onChange={(e) => {
                      setCourseData((prev) => {
                        const updatedProjects = [...prev.courseProjects];
                        updatedProjects[index].projectDesc = e.target.value;
                        return { ...prev, courseProjects: updatedProjects };
                      });
                    }}
                    required
                  />
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ minWidth: 200 }} fullWidth>
                <FormLabel>Select Tutor</FormLabel>
                <Select value={tutorId} onChange={handleTutorChange} displayEmpty required>
                  <MenuItem value="" disabled>
                    Select Tutor
                  </MenuItem>
                  {Array.isArray(tutors) && tutors.length > 0 ? (
                    tutors.map((tutor) => (
                      <MenuItem key={tutor.tutorId} value={tutor.tutorId}>
                        {tutor.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Tutor Available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="">
                Submit
              </Button>
              <Button variant="contained" color="" onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </CrudModal>
  );
};

AddbannerData.propTypes = {
  selectedRowId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddbannerData;
