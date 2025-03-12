import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import no_image_photo from "../../Assets/Images/no_image_available.jpg";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import SectionWrapper from "../SectionWrapper";
import { useEffect, useState } from "react";
import { ListingDetails } from "../../models/Listing";
import { formatTimeAgo, makeLocaleString } from "../../utils/helperMethods";
import apiAgent from "../../utils/apiAgent";
import JobDetailComponent from "./JobDetailComponent";
import ImageSlider from "./ImageSlider";

const ListingDetailView = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [listingDetail, setListingDetail] = useState<ListingDetails>();

  useEffect(() => {
    if (listingId) {
      getlistingById(listingId);
    }
  }, []);

  const getlistingById = async (id: string) => {
    (async () => {
      try {
        const response = await apiAgent.Listings.getListingById(id);
        if (response) {
          setListingDetail(response);
        }
      } catch (error) {
        window.alert("error");
      }
    })();
  };

  return listingDetail ? (
    <Container>
      <h2>{listingDetail.title}</h2>
      <Grid container spacing={10}>
        <Grid
          alignItems={"center"}
          justifyContent={"center"}
          size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
        >
          <Box style={{ width: "100%", height: "100%", maxHeight: "517px" }}>
            {listingDetail.listingImages.length > 0 ? (
              <ImageSlider
                images={listingDetail.listingImages.map(
                  (image: any) => image.url
                )}
              ></ImageSlider>
            ) : (
              <img
                style={{ width: "100%", height: "100%" }}
                src={no_image_photo}
                alt={"listing-image"}
              />
            )}
          </Box>
        </Grid>
        <JobDetailComponent jobDetail={listingDetail} isLargeScreen={true} />
      </Grid>
    </Container>
  ) : (
    <h1>Listing not found</h1>
  );
};
export default ListingDetailView;
const Container = styled.div`
  margin: 40px;
`;
