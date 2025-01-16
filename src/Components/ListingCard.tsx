import { Box, IconButton, Typography } from "@mui/material";
import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { useNavigate } from "react-router-dom";
import { ListingDetails, UpdateCreateJobListingDto } from "../models/Listing";
import { formatTimeAgo } from "../utils/helperMethods";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useState } from "react";
import { ModalContainer } from "./ModalContainer";
import UpdateCreateJobForm from "./UpdateCreateJobForm";
import apiAgent from "../utils/apiAgent";

interface Props {
  listing: ListingDetails;
  onSuccessAfterEditingListing?: Function;
  allowEdit?: boolean;
}

const ListingCard = ({
  listing,
  allowEdit = false,
  onSuccessAfterEditingListing,
}: Props) => {
  const navigate = useNavigate();
  const [showEditJobModal, setShowEditJobModal] = useState<boolean>(false);

  const isJobListing = listing.categoryId === 1;
  const handleEdit = (e: any) => {
    e.stopPropagation();
    setShowEditJobModal(true);
  };

  const updateJobListing = async (body: UpdateCreateJobListingDto) => {
    return await apiAgent.Listings.updateJob(listing!.job!.id, body);
  };

  return (
    <div>
      <Box
        sx={{ cursor: "pointer" }}
        onClick={() =>
          navigate(
            allowEdit
              ? `/myPost/${isJobListing ? "jobs/" : ""}${listing.id}`
              : `/listings/${isJobListing ? "jobs/" : ""}${listing.id}`
          )
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
          {allowEdit && isJobListing && (
            <IconButton
              size="large"
              onClick={(e) => handleEdit(e)}
              color="inherit"
            >
              <ModeEditIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <ModalContainer
        content={
          <UpdateCreateJobForm
            initialObject={{
              minRate: listing.job?.minRate || 0,
              startDate: listing.job?.startDate
                ? new Date(listing.job!.startDate)
                : new Date(),
              title: listing.title,
              description: listing.description,
              categoryId: 1,
              city: listing.city || "",
              state: listing.state || "",
              zipcode: listing.zipcode || "",
            }}
            apiCallback={updateJobListing}
            onSuccess={() => {
              setShowEditJobModal(false);
              onSuccessAfterEditingListing && onSuccessAfterEditingListing();
            }}
          />
        }
        onClose={() => setShowEditJobModal(false)}
        open={showEditJobModal && isJobListing}
        title={"Update Job"}
      />
    </div>
  );
};

export default ListingCard;
