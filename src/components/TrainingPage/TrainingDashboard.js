import { Box, Grid, Card, CardContent, Typography, IconButton, Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "layouts/authentication/components/Footer";
import { Link } from "react-router-dom";
import {
  PersonAdd,
  GroupAdd,
  List,
  School,
  Assignment,
  Payment,
  Book,
  Block,
} from "@mui/icons-material";
import MDBox from "components/MDBox";

const menuItems = [
  {
    title: "Add Users",
    path: "/AddUsers",
    gradient: "#2193b0, #6dd5ed",
    icon: <PersonAdd />,
    description: "Add new users to the system with a streamlined process.",
  },
  {
    title: "Create Batch",
    path: "/CreateBatch",
    gradient: "#ff9966, #ff5e62",
    icon: <GroupAdd />,
    description: "Organize students into structured batches.",
  },
  {
    title: "Trainee Student List",
    path: "/TraineeList",
    gradient: "#9dc2e6, #813cc9",
    icon: <List />,
    description: "View and manage all enrolled trainee students in one place.",
  },
  {
    title: "Trainee Tutor List",
    path: "/TraineeTutorList",
    gradient: "#ffa565, #ff5ead",
    icon: <School />,
    description: "Access a complete list of tutors guiding the trainees.",
  },
  {
    title: "Assign Batch",
    path: "/AssignBatch",
    gradient: "#00b09b, #96c93d",
    icon: <Assignment />,
    description: "Assign student to batches with a seamless workflow.",
  },
  {
    title: "Payment",
    path: "/Payment",
    gradient: "#becaff, #569aff",
    icon: <Payment />,
    description: "Manage and track all financial transactions.",
  },
  {
    title: "Study Material",
    path: "/StudyMaterial",
    gradient: "#9dc2e6, #813cc9",
    icon: <Book />,
    description: "Provide and organize essential learning resources.",
  },
  {
    title: "Deactivate Users",
    path: "/DeactivateUsers",
    gradient: "#cb2d3e, #ef473a",
    icon: <Block />,
    description: "Disable user access when necessary with just a few clicks.",
  },
];

function TrainingDashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} sx={{ minHeight: "100vh", borderRadius: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  background: `white`,
                  color: "white",
                  borderRadius: 2,
                  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    py: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    sx={{
                      background: `radial-gradient(circle, ${item.gradient})`,
                      color: "white",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      mb: 2,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                    {item.description}
                  </Typography>
                  <Link to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <Button variant="contained" sx={{ mt: 2, color: "white !important" }}>
                      View
                    </Button>{" "}
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TrainingDashboard;
