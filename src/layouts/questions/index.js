import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import QuestionList from "components/QuestionBank/QuestionList";
import { useState } from "react";

function Questions() {
  const [searchString, setsearchString] = useState("");
  const handleChange = (data) => {
    setsearchString(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChange} />

      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              <QuestionList searchString={searchString} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Questions;
