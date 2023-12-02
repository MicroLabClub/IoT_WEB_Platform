import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";


import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import MDButton from "components/MDButton";


const projectSoilHumidity = () => {
  const [messages, setMessages] = useState({});


  console.log(messages);

  async function getMessages() {
    try {
      const response = await axios.get('http://localhost:3001/api/messages/');
      console.log(response);

      setMessages({
        labels: response.data.map(x=> x.message_id),
        datasets: { label: "Temperature", data: response.data.map(x=> JSON.parse(x.message).temp) },
      });

      console.log(messages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMessages();
  },[]);

  return (
    <DashboardLayout marginLeft={274}>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="waterdropicon"
                title="Humidity"
                count="55%"
                percentage={{
                  color: "error",
                  amount: "-1",
                  label: "difference",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <MDButton variant="gradient" color="info" fullWidth type="submit" onClick={(e) => getMessages(e)}>
                Load Data
              </MDButton>              
            </MDBox>

            <MDBox mb={1.5}>
            <MDButton variant="gradient" color="info" fullWidth type="submit">
                Set Data
              </MDButton>              
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Statistics of humidity"
                  date="updated 4 min ago"
                  chart={messages}
                /> 
              </MDBox>
            </Grid>

          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default projectSoilHumidity;
