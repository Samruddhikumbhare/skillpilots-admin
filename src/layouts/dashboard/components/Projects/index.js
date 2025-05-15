/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";

// Data
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Projects(props) {
  const [menu, setMenu] = useState(null);
  const navigate = useNavigate();
  const rows = props.studentList;
  const columns = [
    { Header: "Student Name", accessor: "student_name", align: "left" },
    { Header: "Email Id", accessor: "email_id", align: "left" },
    { Header: "Contact Number", accessor: "contact", align: "center" },
    { Header: "Skills", accessor: "skills", align: "center" },
  ];
  console.log(props.studentList);
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Student List
          </MDTypography>
          {/* <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 done</strong> this month
            </MDTypography>
          </MDBox> */}
        </MDBox>
        <MDBox color="text" px={2}>
          <Button
            onClick={() => {
              navigate("/student");
            }}
          >
            View All
          </Button>
        </MDBox>
        {/* {renderMenu} */}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

Projects.propTypes = {
  studentList: PropTypes.array,
};

export default Projects;
