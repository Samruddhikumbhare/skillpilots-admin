// start on 5 march 2025 by  medha

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TestPage from "components/TestPage/CreateTestForm";
import CreateSection from "components/TestPage/CreateSectionForm";
import { TestList } from "components/TestPage/TestList";
import { useState } from "react";

function Test() {
  const [searchString, setsearchString] = useState("");

  // for search function
  const handleChange = (data) => {
    setsearchString(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onDataSend={handleChange} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* create test */}
              <TestPage />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox pt={1} pb={1}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* create section */}
              <CreateSection />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ p: 1, pt: 2 }}>
              {/* show list of section and question */}
              <TestList searchString={searchString} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Test;
