import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { ListingDetails } from "../../models/Listing";
import useMediaQuery from "@mui/material/useMediaQuery";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import apiAgent from "../../utils/apiAgent";
import JobDetailComponent from "./JobDetailComponent";
import ConversationListComponent from "./ConversationListComponent";

const MyJobDetailView = () => {
  // const navigate = useNavigate();
  // const location = useLocation();

  //detect screen size of phone
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const { listingId } = useParams<{ listingId: string }>();
  const [jobDetail, setJobDetail] = useState<ListingDetails>();

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

  useEffect(() => {
    if (listingId) {
      getJobById(listingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onSuccessAfterEditingListing = async () => {
    if (listingId) {
      await getJobById(listingId);
    }
  };
  return (
    <Container>
      <Grid container spacing={10}>
        {listingId && jobDetail?.user?.id ? (
          <ConversationListComponent
            getConversationListBy="listingId"
            listingIdOrUserId={listingId}
            listingOwnerId={jobDetail.user.id}
          ></ConversationListComponent>
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
      </Grid>
    </Container>
  );
};
export default MyJobDetailView;
const Container = styled.div`
  margin: 40px;
`;
