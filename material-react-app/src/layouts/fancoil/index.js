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


const  fancoil= () => {
  const [messages, setMessages] = useState({});
  const [count, setCount] = useState(4);


  console.log(messages);

  async function getMessages() {
    try {
      const requestTemperature = {
        "topic": "microlab/agro/air/temperature"
      };
      const response =
        await axios.post('http://localhost:3001/api/messages/getByTopic', requestTemperature);

      let result = response.data;
      console.log(result.length);

      let shortResult = result.splice(result.length - 50, result.length);

      setMessages({
        labels: shortResult.map(x => new Date(x.date).toLocaleDateString('en-GB', { day: '2-digit', hour: '2-digit', minute: '2-digit'})),
        datasets: { label: "GreenHouse Temperature", data: shortResult.map(x => JSON.parse(x.message).temperature) },
      });

      const resp = shortResult.map(x => JSON.parse(x.message).temperature);
      setCount(resp[49] + "C");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMessages();
    //automatically update the chart data each 5 seconds
    const intervalId = setInterval(() => {
      getMessages();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardLayout marginLeft={274}>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} lg={3.5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="light"
                icon="thermostat"
                title="Temperature GreenHouse "
                count={count}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="light" fullWidth type="submit" onClick={(e) => getMessages(e)}>
                Load Data
              </MDButton>
            </MDBox>

            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="light" fullWidth type="submit">
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
                  color="secondary"
                  title="Temperature in GreenHouse"
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

export default fancoil;