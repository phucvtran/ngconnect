import { Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import {
  ListingDetails,
  UpdateCreateJobListingDto,
} from "../../models/Listing";
import SectionWrapper from "../SectionWrapper";
import { formatTimeAgo, makeLocaleDate } from "../../utils/helperMethods";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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
import apiAgent from "../../utils/apiAgent";
import UpdateCreateJobForm from "../UpdateCreateJobForm";
import { CreateListingRequestDto } from "../../models/ListingRequest";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Props {
  jobDetail: ListingDetails;
  isLargeScreen: boolean;
  onSuccessAfterEditingListing?: Function;
}

const JobDetailComponent = ({
  jobDetail,
  isLargeScreen,
  onSuccessAfterEditingListing,
}: Props) => {
  // get user info
  const currentUser = useSelector((state: RootState) => state.user.userInfo);
  const currentUserId = currentUser?.id;

  const allowEdit = currentUserId && currentUserId === jobDetail?.user?.id;

  const [showEditJobModal, setShowEditJobModal] = useState<boolean>(false);

  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const oneDayFromNow = dayjs().add(25, "hour");
  const [reservationDateTimeArray, setReservationDateTimeArray] = useState<
    Dayjs[]
  >([oneDayFromNow]);

  const [isValidContactInput, setIsValidContactInput] =
    useState<boolean>(false);

  const updateJobListing = async (body: UpdateCreateJobListingDto) => {
    return await apiAgent.Listings.updateJob(jobDetail!.job!.id, body);
  };

  const handleNewReservationDateTime = () => {
    let tempArray = [...reservationDateTimeArray];
    tempArray.push(oneDayFromNow);
    setReservationDateTimeArray(tempArray);
    validateInput();
  };

  const handleOnDateTimeDelete = (index: number) => {
    let tempArray = [...reservationDateTimeArray];
    tempArray.splice(index, 1);
    setReservationDateTimeArray(tempArray);
  };

  const onModalClose = () => {
    setReservationDateTimeArray([oneDayFromNow]);
    setMessage("");
    setIsValidContactInput(false);
    setShowContactModal(false);
  };

  function validateInput() {
    //validate empty message
    if (message.length) {
      // date must be half day in the future;
      const oneDayTenMinutesFromNow = oneDayFromNow.subtract(10, "minute");
      for (let i = 0; i < reservationDateTimeArray.length; i++) {
        if (reservationDateTimeArray[i].isBefore(oneDayTenMinutesFromNow)) {
          setIsValidContactInput(false);
          return;
        }
      }
      setIsValidContactInput(true);
    } else {
      setIsValidContactInput(false);
      return;
    }
  }

  const handleOnDateTimeChange = (newValue: Dayjs, index: number) => {
    let tempArray = [...reservationDateTimeArray];
    tempArray[index] = newValue;
    setReservationDateTimeArray(tempArray);
    validateInput();
  };

  const handleMessageInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (!value) {
      setIsValidContactInput(false);
    } else {
      validateInput();
    }
    setMessage(value);
  };

  const handleContactSubmit = async () => {
    const dayArray = reservationDateTimeArray.map((day) => day.toISOString());
    const requestBody: CreateListingRequestDto = {
      listingId: jobDetail.id,
      reservationDates: dayArray,
      message: message ? message : "",
    };
    try {
      await apiAgent.ListingRequests.createListingRequest(requestBody);
      setShowContactModal(false);
      window.notify("success", "Successfully create request for this listing");
    } catch (error) {
      console.log(error);
    }
  };

  if (jobDetail.job)
    return (
      <Grid
        size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
        sx={isLargeScreen ? {} : { margin: "0 10px" }}
      >
        <SectionWrapper title="">
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h1 style={{ margin: 0 }}>{jobDetail.title}</h1>
              {allowEdit && (
                <IconButton
                  size="large"
                  onClick={() => setShowEditJobModal(true)}
                  color="inherit"
                >
                  <ModeEditIcon />
                </IconButton>
              )}
            </Box>
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
        {allowEdit ? null : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => setShowContactModal(true)}
            >
              Contact
            </Button>
          </Box>
        )}

        <ModalContainer
          title={"Contact"}
          open={showContactModal}
          onClose={onModalClose}
          content={
            <div>
              <DateTimePickerContainer isLargeScreen={isLargeScreen}>
                {reservationDateTimeArray.map((date: Dayjs, index: number) => (
                  <DateTimePickerItem key={index}>
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
                        minDate={oneDayFromNow}
                        maxDate={dayjs(
                          new Date(
                            jobDetail.job?.endDate ? jobDetail.job.endDate : ""
                          )
                        )}
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
                <MessageInput
                  placeholder="Enter your messages"
                  onChange={handleMessageInputChange}
                ></MessageInput>
              </div>
              <ActionButtonContainer>
                <Button
                  variant="contained"
                  onClick={handleContactSubmit}
                  disabled={!isValidContactInput}
                >
                  send
                </Button>
                <Button variant="outlined" onClick={onModalClose}>
                  cancel
                </Button>
              </ActionButtonContainer>
            </div>
          }
        />

        <ModalContainer
          content={
            <UpdateCreateJobForm
              initialObject={{
                minRate: jobDetail.job?.minRate || 0,
                startDate: jobDetail.job?.startDate
                  ? new Date(jobDetail.job!.startDate)
                  : new Date(),
                title: jobDetail.title,
                description: jobDetail.description,
                categoryId: 1,
                city: jobDetail.city || "",
                state: jobDetail.state || "",
                zipcode: jobDetail.zipcode || "",
              }}
              apiCallback={updateJobListing}
              onSuccess={() => {
                setShowEditJobModal(false);
                onSuccessAfterEditingListing && onSuccessAfterEditingListing();
              }}
              isUpdate={true}
            />
          }
          onClose={() => setShowEditJobModal(false)}
          open={showEditJobModal}
          title={"Update Job"}
        />
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
