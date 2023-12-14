import { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDInput from "components/MDInput";

import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import MDButton from "components/MDButton";

import mqtt from "mqtt";
import { host } from "../../config/mqtt.config";

import { options } from "../../config/mqtt.config";

import SolarPowerIcon from '@mui/icons-material/SolarPower';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

const energyPrediction = () => {
  const [message, setMessagesPower] = useState([]);
  const [messagePVoltage, setMessagesPVoltage] = useState([]);
  
  //  console.log(messages);
  async function getMessages() {
    try {
      const response = await axios.post('http://localhost:3001/api/messages/getBySensorId', { "sensor_id": 1 });
      let result = response.data;
      console.log(result.length);

      let shortResult = result.splice(result.length - 20, result.length);
      console.log(shortResult);

      setMessagesPower({
        labels: shortResult.map(x => {
          const dateObject = new Date(x.date);
          const day = dateObject.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
          const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObject); // Get abbreviated month name
          return `${day} ${month}`;
        }),
        datasets: { label: "Temperature", data: shortResult.map(x => JSON.parse(x.message).chargingPower) },
      });

      setMessagesPVoltage({
        labels: shortResult.map(x => {
          const dateObject = new Date(x.date);
          const day = dateObject.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
          const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObject); // Get abbreviated month name
          return `${day} ${month}`;
        }),
        datasets: { label: "Temperature", data: shortResult.map(x => JSON.parse(x.messagePVoltage).pVoltage) },
      });

      console.log(message);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMessages();
  }, []);

  /*   Set Data */
  const [settings, setSettings] = useState(null);

  const changeHandler = (e) => {
    setSettings(e.target.value);
  };

  /* MQTT */
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(null);

  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [chargingPower, setChargingPower] = useState(0);
  const [pVoltage, setPVoltage] = useState(0);


  const tempTopic = 'agrobot/sensors/temperature/sensor-1';
  const humTopic = 'agrobot/sensors/temperature/sensor-2';
  const chargingPowerTopic = 'microlab/agro/device/invertor/chargingPower-1';
  const pVoltageTopic = 'microlab/agro/device/invertor/pVoltage-1';


  const mqttConnect = () => {
    setConnectStatus('Connecting');
    let client = mqtt.connect(host, options);
    setClient(client);
  };

  useEffect(() => {
    mqttConnect();
  }, []);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        setConnectStatus('Connected');

        client.subscribe(tempTopic);
        client.subscribe(humTopic);
        client.subscribe(chargingPowerTopic);
        client.subscribe(pVoltageTopic);
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        setConnectStatus('Message received');

        if (topic === tempTopic) {
          setTemp(JSON.parse(message.toString()).temp);
        } else if (topic === humTopic) {
          setHum(JSON.parse(message.toString()).hum);
        } else if(topic === chargingPowerTopic) {
          setChargingPower(JSON.parse(message.toString()).chargingPower);
        } else if(topic === pVoltageTopic) {
          setPVoltage(JSON.parse(message.toString()).pVoltage);
        console.log(message.toString())
      }
      });
    }
  }, [client]);


  return (
    <DashboardLayout marginLeft={274}>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<BatteryChargingFullIcon/>}
                title="PV Charging Power"
                count={`${chargingPower}W`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="bolt"
                title="PV Input Voltage"
                count={`${pVoltage}V`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<ElectricMeterIcon/>}
                title="AC Input Voltage"
                count={`${chargingPower}V`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="secondary" fullWidth type="submit" onClick={(e) => getMessages(e)}>
                Load Data
              </MDButton>
            </MDBox>
            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="secondary" fullWidth type="submit">
                Set Data
              </MDButton>
            </MDBox>
            <MDBox mb={1.5}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Settings"
                  fullWidth
                  value={settings}
                  name="settings"
                  onChange={changeHandler}
                />
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={6}>
              <MDBox mb={3}>
                 <ReportsLineChart
                  color="success"
                  title="PV Charging Power"
                  date="updated 4 min ago"
                  chart={message}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={8} lg={6}>
              <MDBox mb={3}>
                 <ReportsLineChart
                  color="info"
                  title="PV Input Voltage"
                  date="updated 4 min ago"
                  chart={message}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                 <ReportsLineChart
                  color="dark"
                  title="AC Input Voltage"
                  date="updated 4 min ago"
                  chart={message}
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

export default energyPrediction;
