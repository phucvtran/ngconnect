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
import job_icon from "../../Assets/Images/job-search.png";
import { PaginationResponse } from "../../utils/commonTypes";
import JobDetailComponent from "./JobDetailComponent";

const JobDetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //detect screen size of phone
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const { listingId } = useParams<{ listingId: string }>();
  const [jobDetail, setJobDetail] = useState<ListingDetails>();
  const [jobs, setJobs] = useState<PaginationResponse>();

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
    if (jobDetail && !jobs) {
      getAllJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDetail, jobs]);

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

  // load more param support infinite scroll
  const getAllJobs = async (loadMore?: boolean) => {
    let searchQueryParams: string = `limit=${jobSearchParams.limit}&page=${
      loadMore ? ++jobSearchParams.page : jobSearchParams.page
    }&dir=${jobSearchParams.dir}&sortBy=${jobSearchParams.sortBy}&categoryId=${
      jobSearchParams.categoryId
    }`;

    (async () => {
      try {
        const response: PaginationResponse =
          await apiAgent.Listings.getAllListings(searchQueryParams);
        if (response && jobDetail) {
          response.results = response.results.filter(
            (job) => job.id !== jobDetail.id
          );

          // first load, bring the select job to the top of the list
          if (!loadMore) {
            response.results.unshift(jobDetail);
            setJobs(response);
          } else {
            let moreJobs: any = JSON.parse(JSON.stringify(jobs));
            response.results = response.results.filter(
              (job) => job.id !== jobDetail?.id
            );
            moreJobs.results = moreJobs?.results.concat(response.results);
            setJobs(moreJobs);
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

    //FIXME: can't get updated active job card after updating job
    await getAllJobs();
  };
  return (
    <Container>
      <Grid container spacing={10}>
        {jobs?.results ? (
          <Grid
            size={{ xs: 12, sm: 12, md: 6, lg: 6 }}
            sx={{ maxHeight: "100vh", overflowY: "scroll" }}
          >
            <InfiniteScroll
              dataLength={jobs.total}
              next={() => getAllJobs(true)}
              hasMore={jobs.results.length != jobs.total}
              loader={
                <h4 style={{ textAlign: "center" }}>Loading more jobs...</h4>
              }
              endMessage={
                <h4 style={{ textAlign: "center" }}>No More Jobs Available</h4>
              }
            >
              {jobs.results?.map((job) => {
                return (
                  <SectionWrapper title="" key={job.id}>
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
                        src={job_icon}
                        alt="job"
                      ></img>

                      <div
                        className={
                          job.id === jobDetail?.id
                            ? "selected-job-item job-item"
                            : "job-item"
                        }
                        onClick={() => {
                          setJobDetail(job);
                          if (!isLargeScreen) setOpen(true);
                          navigate(
                            location.pathname.slice(
                              0,
                              location.pathname.lastIndexOf("/")
                            ) + `/${job.id}`
                          );
                        }}
                      >
                        <h2>{job.title}</h2>
                        <h3>
                          $
                          {job.job.minRate +
                            (job.job.maxRate ? ` - $${job.job.maxRate}` : "")}
                          /hour
                        </h3>
                        <p>
                          {formatTimeAgo(new Date(job.createdDate))} -{" "}
                          {job.city}, {job.state} {job.zipcode}
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
      </Grid>
    </Container>
  );
};
export default JobDetailView;
const Container = styled.div`
  margin: 40px;
`;

const jobListContainerStyle = {
  maxHeight: "100vh",
};
