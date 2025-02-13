import styled from "@emotion/styled";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ConversationListComponent from "./ConversationListComponent";
import { ListingRequest } from "../../models/ListingRequest";
import { ConversationComponent } from "./ConversationComponent";
import { socket } from "../../utils/socket";
import { colors } from "../../style/styleVariables";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const InboxView = () => {
  // get user info
  const currentUser = useSelector((state: RootState) => state.user.userInfo);
  const currentUserId = currentUser.id;

  // const navigate = useNavigate();
  // const location = useLocation();

  //detect screen size of phone
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const [selectedRequest, setSelectedRequest] = useState<ListingRequest>();

  // open toggle flag
  const [open, setOpen] = useState<boolean>(true);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    !newOpen && socket.disconnect();
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

  const onRequestSelect = (request: any) => {
    setSelectedRequest(request);
    setOpen(!open);
  };

  const getReceiverUserId = (request: any) => {
    return request.conversations[0].senderId === currentUserId
      ? request.conversations[0].receiverId
      : request.conversations[0].senderId;
  };

  return (
    <Container isLargeScreen={isLargeScreen}>
      {currentUserId && isLargeScreen ? (
        <RequestListContainer>
          <ConversationListComponent
            getConversationListBy="userId"
            listingIdOrUserId={currentUserId}
            listingOwnerId={"listingOwnerId"}
            onConversationSelect={onRequestSelect}
          ></ConversationListComponent>
        </RequestListContainer>
      ) : (
        <ConversationListComponent
          getConversationListBy="userId"
          listingIdOrUserId={currentUserId!}
          listingOwnerId={"listingOwnerId"}
          onConversationSelect={onRequestSelect}
        ></ConversationListComponent>
      )}

      {/* large screen screen layout  */}
      {isLargeScreen && selectedRequest && currentUserId ? (
        <ConversationContainer>
          <ConversationComponent
            listingRequestId={selectedRequest.id}
            senderId={currentUserId}
            receiverId={getReceiverUserId(selectedRequest)}
          ></ConversationComponent>
        </ConversationContainer>
      ) : null}

      {!isLargeScreen && selectedRequest && currentUserId ? (
        <SwipeableDrawer
          // container={document.body}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={56}
          disableSwipeToOpen={true}
          aria-hidden="false"
          ModalProps={{
            keepMounted: true,
          }}
          className="job-detail-drawer"
        >
          <Puller />
          <ConversationComponent
            listingRequestId={selectedRequest.id}
            senderId={currentUserId}
            receiverId={getReceiverUserId(selectedRequest)}
          ></ConversationComponent>
        </SwipeableDrawer>
      ) : null}
    </Container>
  );
};
export default InboxView;

const Container = styled.div<{ isLargeScreen: boolean }>`
  margin: 40px;
  display: ${(props) => (props.isLargeScreen ? "flex" : "block")};
  ${(props) => (props.isLargeScreen ? "gap: 20px" : "")};
`;

const RequestListContainer = styled.div`
  width: 33%;
  padding-right: 25px;
  border-right: solid 2px ${colors.lightGray};
`;

const ConversationContainer = styled.div`
  width: 66%;
`;
