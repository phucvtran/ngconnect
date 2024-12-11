import { Box, Grid2, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { Link, useNavigate } from "react-router-dom";
import { JobDetails, ListingDetails } from "../../models/Listing";
import SectionWrapper from "../SectionWrapper";
import { formatTimeAgo, makeLocaleDate } from "../../utils/helperMethods";
import avatar_image from "../../Assets/Images/img_avatar.png";

interface Props {
  jobDetail: ListingDetails;
  isLargeScreen: boolean;
}

const JobDetailComponent = ({ jobDetail, isLargeScreen }: Props) => {
  const navigate = useNavigate();
  if (jobDetail.job)
    return (
      <Grid
        size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
        sx={isLargeScreen ? {} : { margin: "0 10px" }}
      >
        <SectionWrapper title="">
          <div>
            <h1>{jobDetail.title}</h1>
            <h2>
              $
              {jobDetail.job.minRate +
                (jobDetail.job.maxRate ? ` - $${jobDetail.job.maxRate}` : "")}
              /hour
            </h2>
            <p>
              Posted about {formatTimeAgo(new Date(jobDetail.createdDate))} in{" "}
              {jobDetail.city}, {jobDetail.state} {jobDetail.zipcode}
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper title="User Info">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <div>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
                src={avatar_image}
              ></img>
            </div>
            &nbsp; &nbsp;
            <div>
              <strong>
                {jobDetail?.user?.firstName + " " + jobDetail?.user?.lastName}
              </strong>
              <p>Available From: {makeLocaleDate(jobDetail.job.startDate)}</p>
            </div>
          </Box>
        </SectionWrapper>

        <SectionWrapper title="Description">
          <div>{jobDetail.description}</div>
        </SectionWrapper>
      </Grid>
    );
  else {
    return null;
  }
};

export default JobDetailComponent;
