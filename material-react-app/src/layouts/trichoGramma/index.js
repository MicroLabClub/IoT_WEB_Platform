import Footer from "../../examples/Footer";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import reportsLineChartData from "../dashboard/data/reportsLineChartData";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import MDButton from "components/MDButton";

const TrichoGrammas = () => {
  const defaultPosition = [47.0616, 28.8667];

  const insectImages = [
    {
      id: 1,
      src: "https://images.theconversation.com/files/497355/original/file-20221125-12-6uo1o4.jpg?ixlib=rb-1.1.0&rect=16%2C0%2C5640%2C3842&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
      alt: "Insect 1",
    },
    {
      id: 2,
      src: "https://cdn.britannica.com/22/152822-050-FF5E5F25/Ladybug.jpg",
      alt: "Insect 2",
    },
    {
      id: 3,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY7gqHI2Uvwc7w4p6SHy7646gVs3b0OFQkPg&usqp=CAU",
      alt: "Insect 3",
    },
    {
      id: 4,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSchmDUBSoqdQ_C5xBA_W4lmNRzjgjvsi7TDA&usqp=CAU",
      alt: "Insect 4",
    },
    {
      id: 5,
      src: "https://media.australian.museum/media/dd/images/b1bc3154262548d0925fc63871845fb2.2e16d0ba.fill-600x400.1a6b084.png",
      alt: "Insect 5",
    },
    {
      id: 6,
      src: "https://c02.purpledshub.com/uploads/sites/62/2023/10/What-are-insects.jpg?w=1029&webp=1",
      alt: "Insect 6",
    },
    {
      id: 7,
      src: "https://www.nps.gov/cato/learn/nature/images/7-23-17-Browns-Farm-Trail-36-Spicebush-Swallowtail-Caterpillar.jpg?maxwidth=1300&maxheight=1300&autorotate=false",
      alt: "Insect 7",
    },
    {
      id: 8,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUQkMda7hEjeNRaD6EN0Pc7u3ml4MLpUq-Q&usqp=CAU",
      alt: "Insect 8",
    },
  ];

  const { insects } = reportsLineChartData;

  const devices = [
    { name: "Device 1", coordinates: [47.061536, 28.86671] },
    { name: "Device 2", coordinates: [47.061058, 28.869459] },
    { name: "Device 3", coordinates: [47.059749, 28.868668] },
    { name: "Device 4", coordinates: [47.05995, 28.866798] },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function valuetext(value) {
    return `${value} min`;
  }

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
                      <Marker position={device.coordinates}>
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
                <List
                  component="nav"
                  aria-label="Device settings"
                  sx={{ bgcolor: "background.paper" }}
                >
                  <ListItem
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="Select device"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickListItem}
                  >
                    <ListItemText
                      primary="Select device"
                      secondary={devices[selectedIndex].name}
                    />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "lock-button",
                    role: "listbox",
                  }}
                >
                  {devices.map((option, index) => (
                    <MenuItem
                      key={option.name}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Menu>
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
              <Carousel
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
              >
                {insectImages.map((image) => (
                  <div key={image.id}>
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </Carousel>
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