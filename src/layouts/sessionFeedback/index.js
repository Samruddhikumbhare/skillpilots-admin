// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SessionFeedbackList from "components/SessionFeedbackData.js/SessionFeedbackList";
import { useState } from "react";
import { Card } from "@mui/material";

function SessionFeedback() {
  const [searchString, setsearchString] = useState("");
  const handleChange = (data) => {
    setsearchString(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChange} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              <SessionFeedbackList searchString={searchString} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SessionFeedback;
