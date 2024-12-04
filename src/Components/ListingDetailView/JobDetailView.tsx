import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import image1 from "../../Assets/Images/house1.jpeg";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import SectionWrapper from "../SectionWrapper";
import { useEffect, useState } from "react";
import { ListingDetails } from "../../models/Listing";
import {
  formatTimeAgo,
  makeLocaleString,
  makeLocaleDate,
} from "../../utils/helperMethods";
import apiAgent from "../../utils/apiAgent";

import avatar_image from "../../Assets/Images/img_avatar.png";
import job_icon from "../../Assets/Images/job-search.png";
import { PaginationResponse } from "../../utils/commonTypes";

const JobDetailView = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [jobDetail, setJobDetail] = useState<any>(null);

  const [jobs, setJobs] = useState<PaginationResponse>();

  const jobSearchParams = {
    limit: 100,
    page: 1,
    dir: "DESC",
    sortBy: "updatedDate",
    categoryId: "1",
  };

  useEffect(() => {
    //TODO: call api to get listing details
    console.log("listing ID", listingId);
    if (listingId) {
      getJobById(listingId);
    }
  }, []);

  useEffect(() => {
    //TODO: call api to get listing details
    console.log("listing ID", listingId);
    if (jobDetail && !jobs) {
      // getJobById(listingId);
      getAllJobs();
    }
  }, [jobDetail]);

  const getJobById = (id: string) => {
    (async () => {
      try {
        const response = await apiAgent.Listings.getListingById(id);
        if (response) {
          setJobDetail(response);
          // getAllJobs();
        }
      } catch (error) {
        window.alert("error");
      }
    })();
  };

  const getAllJobs = () => {
    let searchQueryParams: string = `limit=${jobSearchParams.limit}&page=${jobSearchParams.page}&dir=${jobSearchParams.dir}&sortBy=${jobSearchParams.sortBy}&categoryId=${jobSearchParams.categoryId}`;

    (async () => {
      try {
        const response: PaginationResponse =
          await apiAgent.Listings.getAllListings(searchQueryParams);
        console.log(jobDetail);
        if (response && jobDetail) {
          response.results = response.results.filter(
            (job) => job.id !== jobDetail.id
          );
          response.results.unshift(jobDetail);
          // response.results[0].selected = true;
          setJobs(response);
        }
      } catch (error) {
        console.log(error);
        window.alert("error");
      }
    })();
  };

  return (
    <Container>
      <Grid container spacing={10}>
        {jobs?.results ? (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
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
                    ></img>

                    <div
                      className={
                        job.id === jobDetail.id
                          ? "selected-job-item job-item"
                          : "job-item"
                      }
                      onClick={() => {
                        setJobDetail(job);
                      }}
                    >
                      <h2>{job.title}</h2>
                      <h3>
                        $
                        {job.job.minRate +
                          (job.job.maxRate ? ` - $${job.maxRate}/` : "")}
                        /hour
                      </h3>
                      <p>
                        {formatTimeAgo(new Date(job.createdDate))} - {job.city},{" "}
                        {job.state} {job.zipcode}
                      </p>
                    </div>
                  </Box>
                </SectionWrapper>
              );
            })}
          </Grid>
        ) : null}

        {jobDetail ? (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <SectionWrapper title="">
              <div>
                <h1>{jobDetail.title}</h1>
                <h2>
                  $
                  {jobDetail.job.minRate +
                    (jobDetail.job.maxRate ? ` - $${jobDetail.maxRate}/` : "")}
                  /hour
                </h2>
                <p>
                  Posted about {formatTimeAgo(new Date(jobDetail.createdDate))}{" "}
                  in {jobDetail.city}, {jobDetail.state} {jobDetail.zipcode}
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
                    {jobDetail?.user?.firstName +
                      " " +
                      jobDetail?.user?.lastName}
                  </strong>
                  <p>
                    Available From: {makeLocaleDate(jobDetail.job.startDate)}
                  </p>
                </div>
              </Box>
            </SectionWrapper>

            <SectionWrapper title="Description">
              <div>{jobDetail.description}</div>
            </SectionWrapper>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};
export default JobDetailView;
const Container = styled.div`
  margin: 40px;
`;
