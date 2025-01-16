import Grid from "@mui/material/Grid2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import SectionWrapper from "../SectionWrapper";
import { useEffect, useState } from "react";
import { ListingDetails } from "../../models/Listing";
import useMediaQuery from "@mui/material/useMediaQuery";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  formatTimeAgo,
  makeLocaleString,
  makeLocaleDate,
} from "../../utils/helperMethods";
import apiAgent from "../../utils/apiAgent";

import avatar_image from "../../Assets/Images/img_avatar.png";
import { PaginationResponse } from "../../utils/commonTypes";
import JobDetailComponent from "./JobDetailComponent";
import { ListingRequest } from "../../models/ListingRequest";
import ConversationComponent from "./ConversationComponent";

const MyJobDetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //detect screen size of phone
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const { listingId } = useParams<{ listingId: string }>();
  const [jobDetail, setJobDetail] = useState<ListingDetails>();
  const [listingRequests, setListingRequest] = useState<PaginationResponse>();
  const [selectedRequest, setSelectedRequest] = useState<ListingRequest>();

  // open toggle flag
  const [open, setOpen] = useState(true);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const Puller = styled("div")(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: "grey",
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)",
  }));

  const jobSearchParams = {
    limit: 10,
    page: 1,
    dir: "DESC",
    sortBy: "updatedDate",
    categoryId: "1",
  };

  useEffect(() => {
    if (listingId) {
      getJobById(listingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (jobDetail && !listingRequests) {
      getAllRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDetail, listingRequests]);

  const getJobById = async (id: string) => {
    (async () => {
      try {
        const response = await apiAgent.Listings.getListingById(id);
        if (response) {
          setJobDetail(response);
        }
      } catch (error) {
        window.alert("error");
      }
    })();
  };

  // get all request for this listing.
  const getAllRequest = async (loadMore?: boolean) => {
    let searchQueryParams: string = `limit=${jobSearchParams.limit}&page=${
      loadMore ? ++jobSearchParams.page : jobSearchParams.page
    }&dir=${jobSearchParams.dir}&sortBy=${jobSearchParams.sortBy}`;

    (async () => {
      try {
        const response: PaginationResponse =
          await apiAgent.ListingRequests.getRequestsByListingId(
            listingId!,
            searchQueryParams
          );
        if (response && jobDetail) {
          // first load, bring the select job to the top of the list
          console.log(response.results);
          if (!loadMore) {
            setListingRequest(response);
            setSelectedRequest(response.results[0]);
          } else {
            let moreListingRequest: any = JSON.parse(
              JSON.stringify(listingRequests)
            );
            moreListingRequest.results = moreListingRequest?.results.concat(
              response.results
            );
            setListingRequest(moreListingRequest);
          }
        }
      } catch (error) {
        console.log(error);
        window.alert("error");
      }
    })();
  };

  const onSuccessAfterEditingListing = async () => {
    if (listingId) {
      await getJobById(listingId);
    }
  };
  return (
    <Container>
      <Grid container spacing={10}>
        {listingRequests?.results ? (
          <Grid
            size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
            sx={{ maxHeight: "100vh", overflowY: "scroll" }}
          >
            <InfiniteScroll
              dataLength={listingRequests.total}
              next={() => getAllRequest(true)}
              hasMore={listingRequests.results.length != listingRequests.total}
              loader={
                <h4 style={{ textAlign: "center" }}>
                  Loading More Requests...
                </h4>
              }
              endMessage={
                <h4 style={{ textAlign: "center" }}>
                  No More Request Available
                </h4>
              }
            >
              <h1>Messages:</h1>
              {listingRequests.results?.map((request) => {
                return (
                  <SectionWrapper title="" key={request.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginTop: "20px",
                          marginRight: "20px",
                        }}
                        src={avatar_image}
                        alt="job"
                      ></img>

                      <div
                        className={
                          request.id === jobDetail?.id
                            ? "selected-job-item job-item"
                            : "job-item"
                        }
                        onClick={() => {
                          console.log("set up on click open chat"); // open chat
                        }}
                      >
                        <h2>{request.createdUser}</h2>
                        <h3>Reservasation Dates:</h3>
                        <ul>
                          {request.reservationDates.map((date: any) => (
                            <li key={date.id}>{date.reservationDate}</li>
                          ))}
                        </ul>
                        <p>
                          Last Update:{" "}
                          {formatTimeAgo(new Date(request.updatedDate))}
                        </p>
                      </div>
                    </Box>
                  </SectionWrapper>
                );
              })}
            </InfiniteScroll>
          </Grid>
        ) : null}

        {/* large screen screen layout  */}
        {jobDetail && isLargeScreen ? (
          <JobDetailComponent
            jobDetail={jobDetail}
            isLargeScreen={isLargeScreen}
            onSuccessAfterEditingListing={onSuccessAfterEditingListing}
          />
        ) : null}

        {jobDetail && !isLargeScreen ? (
          <SwipeableDrawer
            // container={document.body}
            anchor="bottom"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            swipeAreaWidth={80}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            className="job-detail-drawer"
          >
            <Puller />
            <JobDetailComponent
              jobDetail={jobDetail}
              isLargeScreen={isLargeScreen}
            />
          </SwipeableDrawer>
        ) : null}

        {selectedRequest && jobDetail ? (
          <ConversationComponent
            listingRequestId={selectedRequest.id}
            senderId={jobDetail!.user!.id}
            receiverId={selectedRequest.createdUser + ""}
          ></ConversationComponent>
        ) : null}
      </Grid>
    </Container>
  );
};
export default MyJobDetailView;
const Container = styled.div`
  margin: 40px;
`;

const jobListContainerStyle = {
  maxHeight: "100vh",
};
