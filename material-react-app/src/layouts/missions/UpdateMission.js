import { useEffect, useState } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/user-profile/Header";
import Button from "@mui/material/Button";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const CreateMission = () => {
  const [mission, setMission] = useState({
    device_id: null,
    map_id: "",
    user_id: "",
    ttl: "",
    config: "",
  });

  const [options, setOptions] = useState({
    devicesId: [],
    mapsId: [],
    usersId: []
  })
  const [errors, setErrors] = useState({
    nameError: false,
    descriptionError: false,
    identifierError: false,
    image_deviceError: false,
    image_logoError: false,
  });


  async function getOptions() {
    try {
      const responseDevices = await axios.get(`http://localhost:3001/api/devices/`);
      setOptions((prevOptions) => ({
        ...prevOptions,
        devicesId: responseDevices.data.map((item) => ({ label: String(item.device_id) + " - " + item.name})),
      }));

      const responseMaps = await axios.get(`http://localhost:3001/api/maps/`);
      setOptions((prevOptions) => ({
        ...prevOptions,
        mapsId: responseMaps.data.map((item) => ({ label: String(item.map_id) + " - " + item.name  })),
      }));

      const responseUsers = await axios.get(`http://localhost:3001/api/users/`);
      console.log(responseUsers);

      setOptions((prevOptions) => ({
        ...prevOptions,
        usersId: responseUsers.data.map((item) => ({ label: String(item.user_id) + " - " + item.name})),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  const id = useParams()

  async function getMission() {
    try {
      const response = await axios.get(`http://localhost:3001/api/missions/${id.id}`);
      setMission(response.data)
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    getOptions()
    getMission()
  }, [])



  const changeHandler = (e) => {
    setMission({
      ...mission,
      [e.target.name]: e.target.value,
    });
  };

  const changeHandleAutocomplete = (e, value) => {
     const name = e.target.id.split('-')[0]
     console.log(name);
     console.log(value.label)
    setMission({
      ...mission,
      [name]: value.label,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault()
    const d = new Date();
    const month = d.getMonth()
    const year = d.getFullYear()
    const date = d.getDate()
    const newDate = `${year}/${month}/${date}`
    try {
      axios.put('http://localhost:3001/api/missions/', { ...mission, startDate: newDate, id:id.id });
    } catch (error) {
      console.error(error);
    }
  }

  const navigate = useNavigate()

  const goBackHandler = () => {
    navigate(-1)
  };

  // mission_id: 4,
  // device_id: 1,
  // map_id: 2,
  // user_id: 15,
  // startDate: 2023-11-11T22:00:00.000Z,
  // ttl: 25,
  // config: 'config1'
console.log(mission);

  return (
    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70%" }}>
      <DashboardLayout>
        <Header name="NewMap">
          <MDBox
            component="form"
            role="form"
            onSubmit={submitHandler}
            display="flex"
            flexDirection="column"
          >
            <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDBox mb={2} width="100%">
                  <Autocomplete
                    disablePortal
                    options={options.devicesId}
                    value={mission.device_id}
                    id="device_id"
                    onChange={changeHandleAutocomplete}
                    name="deviceId"
                    clearIcon={null}
                    renderInput={(params) => <TextField {...params} label="Device id" />}
                  />
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                <MDBox mb={0} width="100%">
                  <Autocomplete
                    options={options.mapsId}
                    id="map_id"
                    value={mission.map_id}
                    onChange={changeHandleAutocomplete}
                    renderInput={(params) => <TextField {...params} label="Map id" />}
                  />
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox display="flex" flexDirection="column" mb={3}>
              <MDBox display="flex" flexDirection="row">
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                  mr={0}
                >
                  <MDBox mb={1} width="100%">
                    <Autocomplete
                      options={options.usersId}
                      id="user_id"
                      value={mission.user_id}
                      onChange={changeHandleAutocomplete}
                      renderInput={(params) => <TextField {...params} label="User ID" />}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
            <MDBox display="flex" flexDirection="row" mt={0} mb={0}>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  TTL
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="number"
                    fullWidth
                    name="ttl"
                    placeholder="TTL"
                    value={mission.ttl}
                    onChange={changeHandler}
                  />
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Config
                </MDTypography>
                <MDBox mb={1} width="100%">
                  <MDInput
                    type="text"
                    fullWidth
                    name="config"
                    placeholder="Config"
                    value={mission.config}
                    onChange={changeHandler}
                  />
                </MDBox>
              </MDBox>
            </MDBox>
            <MDBox display="flex" flexDirection="column" mb={3}>
              <MDBox mt={2} display="flex" justifyContent="space-between" >
                <Button onClick={() => goBackHandler()} variant="contained" style={{ color: "white", backgroundColor: "red" }} type="button">
                  Close
                </Button>
                <Button onClick={() => goBackHandler()} variant="contained" style={{ color: "white" }} type="submit">
                  Update Mission
                </Button>
              </MDBox>
            </MDBox>
          </MDBox>
        </Header>
      </DashboardLayout>
    </Box>

  );
};

export default CreateMission;
