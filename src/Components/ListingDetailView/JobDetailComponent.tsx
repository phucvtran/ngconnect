import { Box, Grid2, IconButton, Modal, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

import listingImage from "../Assets/Images/listing.jpg";
import jobImage from "../Assets/Images/job_image.avif";
import { Link, useNavigate } from "react-router-dom";
import { JobDetails, ListingDetails } from "../../models/Listing";
import SectionWrapper from "../SectionWrapper";
import { formatTimeAgo, makeLocaleDate } from "../../utils/helperMethods";
import avatar_image from "../../Assets/Images/img_avatar.png";
import { ModalContainer } from "../ModalContainer";
import { useState } from "react";
import styled from "@emotion/styled";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  jobDetail: ListingDetails;
  isLargeScreen: boolean;
}

const JobDetailComponent = ({ jobDetail, isLargeScreen }: Props) => {
  const navigate = useNavigate();

  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [reservationDateTimeArray, setReservationDateTimeArray] = useState<
    Dayjs[]
  >([dayjs()]);

  const handleNewReservationDateTime = () => {
    let tempArray = [...reservationDateTimeArray];
    tempArray.push(dayjs());
    setReservationDateTimeArray(tempArray);
  };

  const handleOnDateTimeDelete = (index: number) => {
    let tempArray = [...reservationDateTimeArray];
    tempArray.splice(index, 1);
    setReservationDateTimeArray(tempArray);
  };

  const onModalClose = () => {
    setReservationDateTimeArray([dayjs()]);
    setShowContactModal(false);
  };

  const handleOnDateTimeChange = (newValue: Dayjs, index: number) => {
    let tempArray = [...reservationDateTimeArray];
    tempArray[index] = newValue;
    setReservationDateTimeArray(tempArray);
  };

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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={() => setShowContactModal(true)}>
            Contact
          </Button>
        </Box>

        <ModalContainer
          title={"Contact"}
          open={showContactModal}
          onClose={onModalClose}
          content={
            <div>
              <DateTimePickerContainer isLargeScreen={isLargeScreen}>
                {reservationDateTimeArray.map((date: Dayjs, index: number) => (
                  <DateTimePickerItem>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        sx={{
                          padding: "10px",
                        }}
                        label="Reservation Time"
                        disablePast
                        value={dayjs(date)}
                        onChange={(newValue: any) =>
                          handleOnDateTimeChange(newValue, index)
                        }
                        maxDate={dayjs(new Date("2024-12-25"))}
                      />
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleOnDateTimeDelete(index)}
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </LocalizationProvider>
                  </DateTimePickerItem>
                ))}

                <IconButton onClick={handleNewReservationDateTime}>
                  <AddIcon fontSize="large"></AddIcon>
                </IconButton>
              </DateTimePickerContainer>

              <div>
                <h4>Message:</h4>
                <MessageInput placeholder="Enter your messages"></MessageInput>
              </div>
              <ActionButtonContainer>
                <Button
                  variant="contained"
                  onClick={() => console.log(reservationDateTimeArray)}
                >
                  send
                </Button>
                <Button variant="outlined" onClick={onModalClose}>
                  cancel
                </Button>
              </ActionButtonContainer>
            </div>
          }
        ></ModalContainer>
      </Grid>
    );
  else {
    return null;
  }
};

export default JobDetailComponent;

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const MessageInput = styled.textarea`
  border: solid 2px grey;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 10px;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
`;

const DateTimePickerContainer = styled.div<{ isLargeScreen: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isLargeScreen ? "auto auto" : "auto"};
  max-height: 300px;
  overflow-y: scroll;
  padding-top: 10px;
`;

const DateTimePickerItem = styled.div`
  display: flex;
`;
