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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { api } from "Api";

function Dashboard() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    axios
      .get(api + "/newskill/getCounts")
      .then((res) => {
        setDashboardData(res.data);
        setLoader(false);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    // Push the current state to history
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      alert("Back Button is disable");
      // Prevent navigation back
      window.history.pushState(null, null, window.location.href);
    };

    // Listen for the popstate event
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {loader ? (
          <CircularProgress color="info" />
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="people"
                    title="Student"
                    count={dashboardData.internalStudentCount}
                    percentage={{
                      label: "Internal Students",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="people"
                    title="Student"
                    count={dashboardData.externalStudentCount}
                    percentage={{
                      label: "External Students",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="corporate_fare"
                    title="College"
                    count={dashboardData.collegeCount}
                    percentage={{
                      label: "Total College Registered",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="apartment"
                    title="Company"
                    count={dashboardData.companyCount}
                    percentage={{
                      label: "Total Company Registered",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="info"
                      title="Students Registered"
                      chart={{
                        labels: ["M", "T", "W", "T", "F", "S", "S"],
                        datasets: {
                          label: "Student",
                          data: dashboardData.weeklyRegistrations.data,
                        },
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="success"
                      title="Applied for Internship"
                      chart={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: {
                          label: "Intern",
                          data: dashboardData.studentMonthlyRequests.data,
                        },
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="dark"
                      title="Revenue Generate"
                      chart={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: {
                          label: "Revenue Generate",
                          data: dashboardData.monthlyPayments.data,
                        },
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Projects studentList={dashboardData.studentList} />
                </Grid>
              </Grid>
            </MDBox>
          </>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
