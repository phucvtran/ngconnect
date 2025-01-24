import { useEffect, useState } from "react";
import apiAgent from "../../utils/apiAgent";
import { PaginationResponse } from "../../utils/commonTypes";
import { paginationSearchParams } from "../../utils/defaultValues";
import { Box, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import InfiniteScroll from "react-infinite-scroll-component";
import SectionWrapper from "../SectionWrapper";
import avatar_image from "../../Assets/Images/img_avatar.png";
import { formatTimeAgo, makeLocaleDate } from "../../utils/helperMethods";
import { ListingRequest } from "../../models/ListingRequest";
import { ModalContainer } from "../ModalContainer";
import { ConversationComponent } from "./ConversationComponent";
import { socket } from "../../utils/socket";

interface ConversationListProps {
  getConversationListBy: string;
  listingIdOrUserId: string;
  listingOwnerId?: string;
  onConversationSelect?: Function;
}
const ConversationListComponent = ({
  getConversationListBy,
  listingIdOrUserId,
  listingOwnerId,
  onConversationSelect,
}: ConversationListProps) => {
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const [listingRequests, setListingRequest] = useState<PaginationResponse>();
  const [selectedRequest, setSelectedRequest] = useState<ListingRequest>();
  const [showConversationModal, setShowConversationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (!listingRequests) {
      getAllRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingRequests]);

  // get all request for this listing by userID or ListingId.
  const getAllRequest = async (loadMore?: boolean) => {
    let searchQueryParams: string = `limit=${
      paginationSearchParams.limit
    }&page=${
      loadMore ? ++paginationSearchParams.page : paginationSearchParams.page
    }&dir=${paginationSearchParams.dir}&sortBy=${
      paginationSearchParams.sortBy
    }`;

    (async () => {
      try {
        const response: PaginationResponse | undefined =
          getConversationListBy === "listingId"
            ? await apiAgent.ListingRequests.getRequestsByListingId(
                listingIdOrUserId!,
                searchQueryParams
              )
            : getConversationListBy === "userId"
            ? await apiAgent.ListingRequests.getRequestsByUserId(
                listingIdOrUserId!,
                searchQueryParams
              )
            : undefined;
        if (response) {
          if (!loadMore) {
            setListingRequest(response);
            if (getConversationListBy === "userId" && onConversationSelect) {
              isLargeScreen && setSelectedRequest(response.results[0]);
              onConversationSelect(response.results[0]);
            }
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

  const onRequestItemClick = (request: any) => {
    onConversationSelect && onConversationSelect(request);

    socket.disconnect();
    setSelectedRequest(request);
    if (getConversationListBy === "listingId") {
      setShowConversationModal(true);
    } // open chat
    socket.connect();
  };

  return (
    <>
      {listingRequests?.results ? (
        <Grid
          size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
          sx={{ maxHeight: "100vh", overflowY: "scroll" }}
        >
          <InfiniteScroll
            dataLength={listingRequests.total}
            next={() => getAllRequest(true)}
            hasMore={listingRequests.results.length !== listingRequests.total}
            loader={
              <h4 style={{ textAlign: "center" }}>Loading More Requests...</h4>
            }
            endMessage={
              <h4 style={{ textAlign: "center" }}>No More Request Available</h4>
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
                        request.id === selectedRequest?.id &&
                        getConversationListBy === "userId" &&
                        isLargeScreen
                          ? "selected-job-item job-item"
                          : "job-item"
                      }
                      onClick={() => {
                        onRequestItemClick(request);
                      }}
                    >
                      <h2>
                        {getConversationListBy === "listingId"
                          ? request.createdUserObj.firstName +
                            " " +
                            request.createdUserObj.lastName
                          : request.listing.user.firstName +
                            " " +
                            request.listing.user.lastName}
                      </h2>
                      <h3>Reservasation Dates:</h3>
                      <ul>
                        {request.reservationDates.map((date: any) => (
                          <li key={date.id}>
                            {makeLocaleDate(date.reservationDate)}
                          </li>
                        ))}
                      </ul>
                      <p>
                        Last Update:{" "}
                        {formatTimeAgo(
                          new Date(request.conversations[0].updatedDate)
                        )}
                      </p>
                    </div>
                  </Box>
                </SectionWrapper>
              );
            })}
          </InfiniteScroll>
        </Grid>
      ) : null}

      {selectedRequest &&
      listingOwnerId &&
      getConversationListBy === "listingId" ? (
        <ModalContainer
          content={
            <ConversationComponent
              listingRequestId={selectedRequest.id}
              senderId={listingOwnerId}
              receiverId={selectedRequest.createdUser}
            ></ConversationComponent>
          }
          open={showConversationModal}
          title={"Conversation"}
          onClose={() => {
            setShowConversationModal(false);
            socket.disconnect();
            getAllRequest();
          }}
        ></ModalContainer>
      ) : null}
    </>
  );
};

export default ConversationListComponent;
