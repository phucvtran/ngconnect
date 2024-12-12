import { Box, IconButton, Typography } from "@mui/material";
import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { useNavigate } from "react-router-dom";
import { ListingDetails } from "../models/Listing";
import { formatTimeAgo } from "../utils/helperMethods";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface Props {
  listing: ListingDetails;
  allowEdit?: boolean;
}

const ListingCard = ({ listing, allowEdit = false }: Props) => {
  const navigate = useNavigate();

  const isJobListing = listing.categoryId === 1;
  const handleEdit = () => {
    console.log("edit me");
  };
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{listing.title}</Typography>
          <Typography>
            {isJobListing
              ? `$${listing?.job?.minRate}${
                  listing?.job?.maxRate ? " - $" + listing?.job?.maxRate : ""
                } per hour`
              : listing.price
              ? `$${listing.price}`
              : "unknown price"}
          </Typography>
          <Typography>
            {formatTimeAgo(new Date(listing.createdDate))} in {listing.city},{" "}
            {listing.state} {listing.zipcode}
          </Typography>
        </Box>
        {allowEdit && (
          <IconButton size="large" onClick={handleEdit} color="inherit">
            <ModeEditIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ListingCard;
