// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

import College from "layouts/college";
import Company from "layouts/company";
import Package from "layouts/package";
import Department from "layouts/department";
import Technology from "layouts/technology";
import OnlineTest from "layouts/onlinetest";
import Questions from "layouts/questions";
import ReportsList from "layouts/ReportsList";
import TrainingDashboard from "components/TrainingPage/TrainingDashboard";
import AddUsers from "components/TrainingPage/AddUsers";
import CreateBatch from "components/TrainingPage/CreateBatch";
import TraineeList from "components/TrainingPage/TraineeList";
import AssignBatch from "components/TrainingPage/AssignBatch";
import Payment from "components/TrainingPage/Payment";
import Invoice from "components/TrainingPage/Invoices";
import TraineeTutList from "components/TrainingPage/TraineeTutorList";
import StudyMaterial from "components/TrainingPage/StudyMaterials";
import DeactivateUser from "components/TrainingPage/DeactivateUsers";
import AllStudentList from "layouts/student";
import AllAdvertismentList from "layouts/advertisment";
import Meet from "layouts/meet";
import CampusDriveList from "components/TrainingPage/CampusDriveList";
import SessionFeedback from "layouts/sessionFeedback";
import PricingPlans from "layouts/pricingPlans";
import InvoiceReport from "layouts/invoiceReport";
import PlacedStudent from "layouts/placedStudent";
import CompleteInternship from "layouts/completeInternship";
import Test from "layouts/test";
import StudentQuizResult from "layouts/studentQuizResult";

const routes = [
  {
    route: "/",
    component: localStorage.getItem("skillpilotAdminToken") ? <Dashboard /> : <SignIn />,
    key: "login",
    private: false, // Public route
  },
  // {
  //   route: "/login",
  //   component: <SignIn />,
  //   key: "login",
  //   private: false, // Public route
  // },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    private: true,
  },

  {
    type: "collapse",
    name: "College List",
    key: "college",
    icon: <Icon fontSize="small">corporate_fare</Icon>,
    route: "/college",
    component: <College />,
    private: true,
  },
  {
    type: "collapse",
    name: "Company List",
    key: "company",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/company",
    component: <Company />,
    private: true,
  },
  {
    type: "collapse",
    name: "Student List",
    key: "student",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/student",
    component: <AllStudentList />,
    private: true,
  },
  {
    type: "collapse",
    name: "Advertisment List",
    key: "advertisment",
    icon: <Icon fontSize="small">picture_in_picture</Icon>,
    route: "/advertisment",
    component: <AllAdvertismentList />,
    private: true,
  },
  {
    type: "collapse",
    name: "Package List",
    key: "package",
    icon: <Icon fontSize="small">add_card</Icon>,
    route: "/package",
    component: <Package />,
    private: true,
  },
  {
    type: "collapse",
    name: "Department Data",
    key: "department",
    icon: <Icon fontSize="small">home_work</Icon>,
    route: "/department",
    component: <Department />,
    private: true,
  },
  {
    type: "collapse",
    name: "Technology Data",
    key: "technology",
    icon: <Icon fontSize="small">emoji_objects</Icon>,
    route: "/technology",
    component: <Technology />,
    private: true,
  },
  {
    type: "collapse",
    name: "Online Test Data",
    key: "onlinetest",
    icon: <Icon fontSize="small">laptop</Icon>,
    route: "/onlinetest",
    component: <OnlineTest />,
    private: true,
  },
  {
    type: "collapse",
    name: "Quiz Test",
    key: "test",
    icon: <Icon fontSize="small">dvr</Icon>,
    route: "/test",
    component: <Test />,
    private: true,
  },
  {
    type: "collapse",
    name: "Quiz Result",
    key: "testResult",
    icon: <Icon fontSize="small">playlist_add_check_circle </Icon>,
    route: "/testResult",
    component: <StudentQuizResult />,
    private: true,
  },
  {
    type: "collapse",
    name: "Meet",
    key: "meet",
    icon: <Icon fontSize="small">devices</Icon>,
    route: "/meet",
    component: <Meet />,
    private: true,
  },
  {
    type: "collapse",
    name: "Question",
    key: "Questions",
    icon: <Icon fontSize="small">quiz</Icon>,
    route: "/Questions",
    component: <Questions />,
    private: true,
  },
  // {
  //   type: "collapse",
  //   name: "Reports",
  //   key: "Reports",
  //   icon: <Icon fontSize="small">Reports</Icon>,
  //   route: "/Reports",
  //   component: <ReportsList />,
  //   private: true,
  // },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    private: true,
  },
  {
    type: "collapse",
    name: "Recruitment",
    key: "driveCampus",
    icon: <Icon fontSize="small">connect_without_contact_icon</Icon>,
    route: "/driveCampus",
    component: <CampusDriveList />,
    private: true,
  },
  {
    type: "collapse",
    name: "Training Dashboard",
    key: "TrainingDashboard",
    icon: <Icon fontSize="small">engineering</Icon>,
    route: "/TrainingDashboard",
    component: <TrainingDashboard />,
    private: true,
  },
  {
    type: "collapse",
    name: "Session Feedback",
    key: "SessionFeedback",
    icon: <Icon fontSize="small">feed</Icon>,
    route: "/SessionFeedback",
    component: <SessionFeedback />,
    private: true,
  },
  {
    type: "collapse",
    name: "Invoice Report",
    key: "InvoiceReport",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "/InvoiceReport",
    component: <InvoiceReport />,
    private: true,
  },
  {
    type: "collapse",
    name: "Pricing Plans",
    key: "PricingPlans",
    icon: <Icon fontSize="small">currency_rupee_icon</Icon>,
    route: "/PricingPlans",
    component: <PricingPlans />,
    private: true,
  },

  {
    type: "collapse",
    name: "Complete Internship",
    key: "CompleteInternship",
    icon: <Icon fontSize="small">domain_verification_icon</Icon>,
    route: "/CompleteInternship",
    component: <CompleteInternship />,
    private: true,
  },

  {
    type: "collapse",
    name: "Placed Student",
    key: "PlacedStudent",
    icon: <Icon fontSize="small">diversity_3</Icon>,
    route: "/PlacedStudent",
    component: <PlacedStudent />,
    private: true,
  },
  {
    route: "AddUsers",
    component: <AddUsers />,
    private: true,
    key: "adduser",
  },
  {
    route: "CreateBatch",
    component: <CreateBatch />,
    private: true,
    key: "createbatch",
  },
  {
    route: "AssignBatch",
    component: <AssignBatch />,
    key: "assignbatch",
    private: true,
  },
  {
    route: "TraineeList",
    component: <TraineeList />,
    key: "trainlist",
    private: true,
  },
  {
    route: "TraineeTutorList",
    component: <TraineeTutList />,
    private: true,
  },
  {
    route: "Payment",
    component: <Payment />,
    key: "payment",
    private: true,
  },
  {
    route: "StudyMaterial",
    key: "studymaterial",
    component: <StudyMaterial />,
    private: true,
  },
  {
    route: "/invoice/:rid/:studentName/:studentId",
    component: <Invoice />,
    private: true,
  },
  {
    route: "/DeactivateUsers",
    key: "profile",
    component: <DeactivateUser />,
    private: true,
  },

  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  //   private: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
