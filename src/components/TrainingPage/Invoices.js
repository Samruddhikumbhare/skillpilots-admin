import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../Api";
import "./payment.css";
import "./invoice.css";

// Sample data (you might want to fetch this from an API)
const sampleData = {
  invoiceNumber: "INV-123456",
  date: "September 10, 2024",
  company: {
    name: "Cluematrix Technologies Pvt.Ltd",
    address: "Vaishnavi Nagar, Nagpur, India",
    phone: "+ 91 8999610381",
    email: "info@cluematrix.com",
  },
  client: {
    name: "John Doe",
    batch: "Java Fullstack 1",
    email: "john.doe@example.com",
  },
  items: [
    {
      description: "1st Installment Amount",
      status: "Paid",
      mode: "cash",
    },
  ],
};

// Create table rows
function createData(description, status) {
  return { description, status };
}

// Data rows for table
const rows = sampleData.items.map((item) => createData(item.description, item.status));

const Invoice = () => {
  const { invoiceNumber, date, company, client } = sampleData;
  const { rid, studentName, studentId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [student, setStudent] = useState(null);
  const [paidamt, setPaidamt] = useState(null);
  const [paidamttotal, setPaidamttotal] = useState(null);
  const downloadPDF = (studentId) => {
    if (!studentId) {
      console.error("Student ID is not defined");
      return;
    }

    const input = document.getElementById("invoice");

    // Set static dimensions for horizontal (landscape) layout
    input.style.width = "1123px"; // Increase width (landscape)
    input.style.height = "994px"; // Reduce height to fit landscape aspect ratio

    html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scale: 2, // Increase scale for better resolution
    }).then((canvas) => {
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "invoice.png");

        try {
          // Send the image to the API
          const response = await fetch(`${api}/newskill/createReceipt?studentId=${studentId}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Image successfully sent to API:", data);

          // Create a URL for the blob and download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "invoice.png"; // Set the file name
          document.body.appendChild(link);
          link.click(); // Programmatically click the link to trigger the download
          document.body.removeChild(link); // Remove the link from the DOM

          // Release the object URL after the download
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
      }, "image/png");
    });
  };

  const getpaid = async (rid) => {
    try {
      const res = await axios.get(api + `/newskill/receipt?rid=${rid}`);
      setPaidamt(res.data);
    } catch (err) {
      console.error("Error fetching reciept data:", err);
    }
  };

  const getUserById = async (studentId) => {
    try {
      const res = await axios.get(api + `/newskill/getById?id=${studentId}`);
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching student data:", err);
    }
  };

  React.useEffect(() => {
    getpaid(rid);
    getUserById(studentId);
  }, [rid, studentId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container
        className="invoice-background"
        id="invoice"
        sx={{ padding: 4, border: "1px solid green", backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <Paper sx={{ padding: 3, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Payment Receipt
          </Typography>
          <Box id="logo"></Box>
          <Typography variant="h6">Receipt Number: Clue/2023-24/{rid}</Typography>
          <Typography variant="h6">Date: {paidamt ? paidamt.date : "Loading..."}</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">Company Details</Typography>
              <Typography>{company.name}</Typography>
              <Typography>{company.address}</Typography>
              <Typography>{company.phone}</Typography>
              <Typography>{company.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Student Details</Typography>
              <Typography>Name : {studentName}</Typography>
              <Typography>Batch :{paidamt?.batchName || "Loading..."}</Typography>
              <Typography>Email: {student?.email || "Loading..."}</Typography>
              <Typography>Fees: ₹{student?.batchfees || "Loading..."} /-</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <TableContainer component={Paper}>
            <Table aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {/* <TableCell component="th" scope="row" align="left">
                      {paidamt?.instId || "Loading..."}
                    </TableCell> */}

                    <TableCell align="left">
                      <b>Paid Amount: ₹</b> &nbsp;{paidamt ? paidamt.paid : "Loading..."} /-
                    </TableCell>

                    <TableCell align="left">
                      <b>Mode:</b> &nbsp;{paidamt ? paidamt.mode : "Loading..."}
                    </TableCell>
                    <TableCell align="left">
                      <b>Status:</b> &nbsp;{row.status}
                    </TableCell>

                    <TableCell align="left">
                      <b>Balance: ₹</b>&nbsp;
                      {paidamt ? paidamt.balance : "Loading..."} /-
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ my: 2 }} />
          <Box id="sign"></Box>
        </Paper>
      </Container>
      <center>
        {" "}
        <Button variant="contained" color="" onClick={() => downloadPDF(studentId)} sx={{ mt: 2 }}>
          Download /SEND TO APP
        </Button>
      </center>
    </DashboardLayout>
  );
};

export default Invoice;
