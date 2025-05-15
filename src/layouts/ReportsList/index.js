import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Reports from "components/Reports/Reports";
import { useState } from "react";

function ReportsList() {
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
            <Card>
              <Reports searchString={searchString} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ReportsList;
