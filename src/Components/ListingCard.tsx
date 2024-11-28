import { Box, Grid2, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { Link, useNavigate } from "react-router-dom";
import { ListingDetails } from "../models/Listing";

interface Props {
  listing: ListingDetails;
}

const ListingCard = ({ listing }: Props) => {
  const navigate = useNavigate();

  function isJobListing(listing: ListingDetails): boolean {
    return listing.categoryId == 1;
  }

  return (
    <Box
      sx={{ cursor: "pointer" }}
      onClick={() =>
        navigate(
          `/listings/${isJobListing(listing) ? "jobs/" : ""}${listing.id}`
        )
      }
    >
      <Box sx={{ height: "250px" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          src={isJobListing(listing) ? jobImage : listingImage}
        />
      </Box>
      <Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{listing.title}</Typography>
          <Typography>
            {(listing.price ? "$" + listing.price : "unknown price") +
              (isJobListing(listing) ? "/hour" : "")}
          </Typography>
          <Typography>{listing.city + ", " + listing.state}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ListingCard;
