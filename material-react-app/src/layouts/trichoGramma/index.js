import Footer from "../../examples/Footer";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import reportsLineChartData from "../dashboard/data/reportsLineChartData";

/*import bogomol from "../../assets/images/insects/bogomol.png";
import buburuza from "../../assets/images/insects/buburuza.png";
import cerep from "../../assets/images/insects/cerep.png";
import jesti from "../../assets/images/insects/jesti.png";
import juk from "../../assets/images/insects/juk.png";
import myxa from "../../assets/images/insects/myxa.png";
import omida from "../../assets/images/insects/omida.png";
import party from "../../assets/images/insects/party.png";*/

const TrichoGrammas = () => {
    const defaultPosition = [47.06164579313581, 28.866706341069374];

    const insectImages = [
        { id: 1, src: "../../assets/images/insects/bogomol.png", alt: 'Insect 1' },
        { id: 2, src: "../../assets/images/insects/buburuza.png", alt: 'Insect 2' },
        { id: 3, src: "../../assets/images/insects/cerep.png", alt: 'Insect 3' },
        { id: 4, src: "../../assets/images/insects/jesti.png", alt: 'Insect 4' },
        { id: 5, src: "../../assets/images/insects/juk.png", alt: 'Insect 5' },
        { id: 6, src: "../../assets/images/insects/myxa.png", alt: 'Insect 6' },
        { id: 7, src: "../../assets/images/insects/omida.png", alt: 'Insect 7' },
        { id: 8, src: "../../assets/images/insects/party.png", alt: 'Insect 8' },
    ];

    const { insects } = reportsLineChartData;

    return (
        <DashboardLayout marginLeft={274}>
            <DashboardNavbar />
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                    <Card className="mapCard">
                        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                            <MDBox>
                                <MDTypography variant="h6" gutterBottom>
                                    GPS Tracking
                                </MDTypography>
                                <div style={{ width: '550%', height: '500px' }}> {/* Adjusted width */}
                                    <MapContainer
                                        center={defaultPosition}
                                        zoom={18}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />
                                    </MapContainer>
                                </div>
                            </MDBox>
                        </MDBox>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Card className="nearMapCard" style={{ height: '100%' }}>
                        <MDBox display="flex" flexDirection="column" alignItems="center" p={3}>
                            <MDTypography variant="h6" gutterBottom>
                                Snapshots
                            </MDTypography>
                            <Carousel showArrows={true} infiniteLoop={true} showThumbs={false}>
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

            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                </Grid>
            </Grid>

            <MDBox mt={4.5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <MDBox mb={3}>
                            <ReportsLineChart
                                color="success"
                                title="Statistics"
                                date="updated 4 min ago"
                                chart={insects}
                            />
                        </MDBox>
                    </Grid>

                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
};

export default TrichoGrammas;