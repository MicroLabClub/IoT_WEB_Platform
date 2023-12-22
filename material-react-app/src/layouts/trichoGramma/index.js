import Footer from "../../examples/Footer";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import reportsLineChartData from "../dashboard/data/reportsLineChartData";
import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import MDButton from "components/MDButton";

const TrichoGrammas = () => {
  const defaultPosition = [47.0616, 28.8667];
  const uploads = "uploads";
  const procUploads = "proc_uploads";

  const insectImages = [
    {
      index: 1,
      src: "http://172.17.10.22:5000/uploads/Wed_Dec_13_18:10:32_2023_dev1.jpg",
      alt: "Insect 1",
    },
    {
      index: 2,
      src: "http://172.17.10.22:5000/proc_uploads/final_photo_2023-09-28_16-29-55.jpg",
      alt: "Insect 2",
    },
  ];

  const serverUrl = "http://172.17.10.22:5000";
  const [images, setImages] = useState([]);
  const fetchInfo = async () => {
    const res = await fetch(serverUrl.concat("/collect"));
    const d = await res.json();
    return setImages(d);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const lists = Object.keys(images).map((key) => {
    const imagesList = images[key].map((url, index) => ({
      index: index + 1,
      url: serverUrl.concat(
        "/",
        Array.from(key)[0] === "p"
          ? procUploads.concat("/", url)
          : uploads.concat("/", url)
      ),
      alt: url,
    }));
    return { key, imagesList };
  });

  const { insects } = reportsLineChartData;

  const devices = [
    { index: 1, name: "Device 1", coordinates: [47.061536, 28.86671] },
    { index: 2, name: "Device 2", coordinates: [47.061058, 28.869459] },
  ];

  function valuetext(value) {
    return `${value} min`;
  }

  const [selectedDeviceIndex, setSelectedDeviceIndex] = React.useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedKey, setSelectedKey] = React.useState();

  const handleSelectedKeyChange = (event, key) => {
    setSelectedKey(key);
    setSelectedImageIndex(1);
  };

  const handleDeviceListItemClick = (event, index) => {
    setSelectedDeviceIndex(index);
  };

  const handleImageListItemClick = (event, index) => {
    setSelectedImageIndex(index);
  };

  const freeIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [20, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const selectedIcon = new L.Icon({
    iconUrl:
      "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <DashboardLayout marginLeft={274}>
      <DashboardNavbar />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
            >
              <div>
                <MDTypography variant="h6" gutterBottom>
                  GPS Tracking
                </MDTypography>
                <div style={{ width: "550px", height: "600px", flex: 1 }}>
                  {" "}
                  {/* Adjusted width */}
                  <MapContainer
                    center={defaultPosition}
                    zoom={18}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {devices.map((device) => (
                      <Marker
                        position={device.coordinates}
                        icon={
                          device.index === selectedDeviceIndex
                            ? selectedIcon
                            : freeIcon
                        }
                      >
                        <Popup>{device.name}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={3}
              >
                <MDTypography variant="h6" gutterBottom>
                  Devices
                </MDTypography>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 200,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 300,
                    "& ul": { padding: 0 },
                  }}
                >
                  {devices.map((device) => (
                    <ListItemButton
                      selected={selectedDeviceIndex === device.index}
                      onClick={(event) =>
                        handleDeviceListItemClick(event, device.index)
                      }
                    >
                      <ListItemText primary={device.name} />
                    </ListItemButton>
                  ))}
                </List>
                <br />
                <MDTypography variant="h6" gutterBottom>
                  Image sets
                </MDTypography>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 200,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 600,
                    "& ul": { padding: 0 },
                  }}
                >
                  {lists.map(
                    (
                      el // el means element
                    ) => (
                      <ListItemButton
                        selected={selectedKey && selectedKey.key === el.key}
                        onClick={(event) => handleSelectedKeyChange(event, el)}
                      >
                        <ListItemText primary={el.key} />
                      </ListItemButton>
                    )
                  )}
                </List>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Card className="nearMapCard" style={{ height: "100%" }}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={3}
            >
              <MDTypography variant="h6" gutterBottom>
                Snapshots
              </MDTypography>
              <Grid container spacing={2} p={5}>
                <Grid xs={3} md={3} lg={3} sx={{ maxHeight: 600 }}>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 220,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 520,
                        "& ul": { padding: 0 },
                      }}
                    >
                      {selectedKey !== undefined ? (
                        selectedKey.imagesList.map((image) => (
                          <ListItemButton
                            selected={selectedImageIndex === image.index}
                            onClick={(event) =>
                              handleImageListItemClick(event, image.index)
                            }
                          >
                            <ListItemText primary={image.alt} />
                          </ListItemButton>
                        ))
                      ) : (
                        <p>No image set selected</p>
                      )}
                    </List>
                  </MDBox>
                </Grid>
                <Grid xs={9} md={9} lg={9}>
                  <MDBox display="flex" p={3} alignItems="center">
                    {selectedImageIndex && selectedKey ? (
                      <img
                        src={
                          selectedKey.imagesList.find(
                            (image) => image.index === selectedImageIndex
                          ).url
                        }
                        alt={
                          selectedKey.imagesList.find(
                            (image) => image.index === selectedImageIndex
                          )?.alt || "No alt text available"
                        }
                        style={{ maxWidth: "500px", maxHeight: "600px" }}
                      />
                    ) : (
                      <p>No image selected</p>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      <br />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card className="nearMapCard" style={{ height: "100%" }}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={3}
            >
              <MDTypography variant="h6" gutterBottom>
                Configuration
              </MDTypography>
              <Box sx={{ width: 300 }}>
                <MDTypography variant="caption" gutterBottom>
                  Photo Frequency (min)
                </MDTypography>
                <Slider
                  aria-label="Photo Frequency"
                  defaultValue={30}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={120}
                />
              </Box>
              <Box>
                <MDButton>Upload Photo</MDButton>
                <MDButton>Delete Photo</MDButton>
              </Box>
            </MDBox>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <div style={{ paddingTop: "25px", height: "100%" }}>
            <ReportsLineChart
              color="success"
              title="Statistics"
              date="updated 4 min ago"
              chart={insects}
            />
          </div>
        </Grid>
      </Grid>

      <Footer />
    </DashboardLayout>
  );
};

export default TrichoGrammas;
