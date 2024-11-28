import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Pagination from "@mui/material/Pagination";

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ListingCard from "./ListingCard";
import { ListingDetails } from "../models/Listing";
import apiAgent from "../utils/apiAgent";
import { PaginationResponse } from "../utils/commonTypes";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Home = () => {
  const [listings, setListings] = useState<PaginationResponse>();
  const [listingSearchParams, setListingSearchParams] = useState({
    limit: 10,
    page: 1,
    dir: "DESC",
    sortBy: "updatedDate",
    categoryIds: [] as string[],
  });

  useEffect(() => {
    getAllListings();
  }, [listingSearchParams]);

  const getAllListings = () => {
    let searchQueryParams: string = `limit=${listingSearchParams.limit}&page=${listingSearchParams.page}&dir=${listingSearchParams.dir}&sortBy=${listingSearchParams.sortBy}`;

    // build params
    if (listingSearchParams.categoryIds.length > 0) {
      searchQueryParams +=
        "&categoryId" + listingSearchParams.categoryIds.join(",");
    }

    (async () => {
      try {
        const response = await apiAgent.Listings.getAllListings(
          searchQueryParams
        );
        if (response) {
          setListings(response);
        }
      } catch (error) {
        window.alert("error");
      }
    })();
  };

  const handlePaginationChange = (event: React.ChangeEvent, page: number) => {
    listingSearchParams.page = page;
    setListingSearchParams(listingSearchParams);
    getAllListings();
  };

  return (
    <Container maxWidth="xl">
      <Container maxWidth="xl">
        <Box
          sx={{
            mt: "50px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 6, sm: 6, md: 12, lg: 12 }}
          >
            {listings?.results.map((prop: any) => {
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={prop.id}>
                  <ListingCard listing={prop}></ListingCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>

      {/* pagination container  */}
      <Container className="pagination-container" maxWidth="xl">
        <Pagination
          size="large"
          count={listings?.totalPages}
          showFirstButton
          showLastButton
          onChange={(e: any, page: number) => handlePaginationChange(e, page)}
        />
      </Container>
    </Container>
  );
};

export default Home;
