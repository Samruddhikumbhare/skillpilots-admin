import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpg";
import { Link } from "react-router-dom";
import { api } from "Api";
import logo from "../../../assets/images/logo white.png";
import { Box } from "@mui/material";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    try {
      const response = await fetch(api + "/newskill/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const res = await response.json();

      if (res.statusCode === 200) {
        // alert("User logged in successfully");
        if (res.user.role == "ADMIN") {
          localStorage.setItem("skillpilotAdminToken", res.token);
          localStorage.setItem("Admin", res.user.role);
          localStorage.setItem("id", res.user.id);
          localStorage.setItem("user", JSON.stringify(res.user));
          // Redirect to the dashboard or other page
          navigate("/dashboard");
        } else {
          alert("Your current role does not allow access to the admin dashboard.");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 0, mb: 2 }}>
            <Grid item xs={12}>
              <img src={logo} alt="logo" style={{ height: "35px", width: "auto" }} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} pb={3} px={3}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <h3>Login </h3>
          </Box>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
                Log in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
