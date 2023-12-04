import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";


import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import MDButton from "components/MDButton";
import { Typography } from "@mui/material";




const fancoil = () => {
  const [messages, setMessages] = useState([])

  console.log(messages);


  async function getMessages() {
    try {
      const response = await axios.get('http://localhost:3001/api/users/');
      setMessages(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  



  const { sales } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} lg={3.5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="light"
                icon="thermostat"
                title="Temperature GreenHouse"
                count={
                  <>
                  22
                  <Typography variant="body2" component="span" color="textSecondary" style={{fontWeight: 'inherit'}}>
                  °C
                  </Typography>
                    </>
                }
                
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                 color="light"
                 icon="thermostat"
                 title="STATUS FANCoil"
                 count={
                   <>
                   ON/OFF
                   <Typography variant="body2" component="span" color="textSecondary" style={{fontWeight: 'inherit'}}>
                   
                   </Typography>
                     </>
                 }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={1}>
               <MDBox mb={1.5}>
                  <MDButton
                      variant="gradient"
                      color="light"
                      fullWidth
                      type="submit"
                            onClick={(e) => getMessages(e)}
                      style={{ borderRadius: '12px' }} 
                   >
                  <strong>ON</strong>
                  </MDButton>
                </MDBox>

                <MDBox mb={1.5}>
                  <MDButton
                      variant="gradient"
                      color="light"
                      fullWidth
                      type="submit"
                      style={{ borderRadius: '12px' }} // Set border radius for a square button
                    >
                 <strong>OFF</strong>
                   </MDButton>
                  </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={10}>
          <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={10}>
                <ReportsLineChart
                  color="secondary"
                  title="Statistics per Day"
                  description={
                    <>
                      Today Temperature in GreenHouse is Perfect!
                    </>
                  }
                  date="updated 20 min ago"
                  chart={sales}
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

export default fancoil;
