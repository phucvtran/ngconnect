import { Box, Typography } from "@mui/material";
import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { useNavigate } from "react-router-dom";
import { ListingDetails } from "../models/Listing";
import { formatTimeAgo } from "../utils/helperMethods";

interface Props {
  listing: ListingDetails;
}

const ListingCard = ({ listing }: Props) => {
  const navigate = useNavigate();

  const isJobListing = listing.categoryId === 1;

  return (
    <Box
      sx={{ cursor: "pointer" }}
      onClick={() =>
        navigate(`/listings/${isJobListing ? "jobs/" : ""}${listing.id}`)
      }
    >
      <Box sx={{ height: "250px" }}>
        <img
          alt=""
          style={{ width: "100%", height: "100%" }}
          src={isJobListing ? jobImage : listingImage}
        />
      </Box>
      <Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{listing.title}</Typography>
          <Typography>
            {isJobListing
              ? `$${listing?.job?.minRate}${
                  listing?.job?.maxRate ? " - $" + listing?.job?.maxRate : ""
                } per hour`
              : listing.price != null && listing.price != undefined
              ? `$${listing.price}`
              : "unknown price"}
          </Typography>
          <Typography>
            {formatTimeAgo(new Date(listing.createdDate))} in {listing.city},{" "}
            {listing.state} {listing.zipcode}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ListingCard;
