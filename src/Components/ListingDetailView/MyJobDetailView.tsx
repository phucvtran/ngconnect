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
import { colors } from "../../style/styleVariables";
import { Typography } from "@mui/material";
import listingImage from "../../Assets/Images/house1.jpeg";
import jobImage from "../../Assets/Images/job_image.avif";

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

  const drawerBleeding = 56;

  const Puller = styled("div")(({ theme }) => ({
    width: 45,
    height: 6,
    backgroundColor: "grey",
    borderRadius: 3,
    position: "absolute",
    top: 12,
    left: "calc(50% - 22px)",
  }));

  const StyleBox = styled("div")(({ theme }) => ({
    position: "absolute",
    top: -drawerBleeding,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    visibility: "visible",
    right: 0,
    left: 0,
    backgroundColor: colors.lightBlue,
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
      <div
        style={{
          position: "relative",
          width: "60%",
          height: "60%",
          maxHeight: "517px",
        }}
      >
        <img
          style={{ width: "100%", height: "100%", marginLeft: "33%" }}
          src={jobDetail?.job ? jobImage : listingImage}
          alt={"listing-image"}
        />
      </div>
      <hr></hr>
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
            swipeAreaWidth={56}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            className="job-detail-drawer"
          >
            <StyleBox>
              <Puller />
              <Typography
                sx={{
                  p: 2,
                  color: colors.textColor,
                  textAlign: "center",
                  padding: 0,
                  margin: "24px 0 8px 0",
                }}
              >
                Listing Description
              </Typography>
            </StyleBox>
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
