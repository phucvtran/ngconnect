import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import image1 from "../../Assets/Images/house1.jpeg";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import SectionWrapper from "../SectionWrapper";
import { useEffect, useState } from "react";
import { ListingDetails } from "../../models/Listing";
import { formatTimeAgo, makeLocaleString } from "../../utils/helperMethods";

const fakeData = {
  id: "1",
  title: "Fixing Iphone 12's screen",
  categoryId: 0,
  price: 95.0,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi`,
  createdDate: new Date("2024-01-15 02:11:59"),
  status: "ACTIVE",
  city: "Seattle",
  state: "WA",
  zipcode: "98178",
};
const ListingDetailView = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [listingDetails] = useState<ListingDetails>(fakeData);

  useEffect(() => {
    console.log(listingId);
    //TODO: call api to get listing details
  }, []);

  return (
    <Container>
      <h2>{listingDetails.title}</h2>
      <Grid container spacing={10}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box style={{ width: "100%", height: "100%", maxHeight: "517px" }}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={image1}
              alt={"listing-image"}
            />
          </Box>
          <SectionWrapper title="Description">
            <div>{listingDetails.description}</div>
          </SectionWrapper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionWrapper title="">
            <div>
              <h1>${makeLocaleString(listingDetails.price)}</h1>
              <p>
                Posted about{" "}
                {formatTimeAgo(new Date(listingDetails.createdDate))} in{" "}
                {listingDetails.city}, {listingDetails.state}{" "}
                {listingDetails.zipcode}
              </p>

              <p>Category: {listingDetails.categoryId}</p>
            </div>
          </SectionWrapper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default ListingDetailView;
const Container = styled.div`
  margin: 40px;
`;
