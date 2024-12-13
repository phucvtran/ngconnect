import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Pagination from "@mui/material/Pagination";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingCard from "./ListingCard";
import { PaginationResponse } from "../utils/commonTypes";

interface Props {
  getListingsCallback: Function;
  allowEdit?: boolean;
}
const ListingList = ({ getListingsCallback, allowEdit = false }: Props) => {
  const { jobPathParam } = useParams();
  const [listings, setListings] = useState<PaginationResponse>();
  const [listingSearchParams, setListingSearchParams] = useState({
    limit: 10,
    page: 1,
    dir: "DESC",
    sortBy: "updatedDate",
    categoryIds: [] as string[],
  });

  const getAllListings = useCallback(async () => {
    let searchQueryParams: string = `limit=${listingSearchParams.limit}&page=${listingSearchParams.page}&dir=${listingSearchParams.dir}&sortBy=${listingSearchParams.sortBy}`;

    // build params
    if (jobPathParam === "jobs") {
      searchQueryParams += "&categoryId=1";
    } else if (listingSearchParams.categoryIds.length > 0) {
      searchQueryParams +=
        "&categoryId" + listingSearchParams.categoryIds.join(",");
    }

    (async () => {
      try {
        const response = await getListingsCallback(searchQueryParams);
        if (response) {
          setListings(response);
        }
      } catch (error) {
        window.alert("error");
      }
    })();
  }, [
    getListingsCallback,
    jobPathParam,
    listingSearchParams.categoryIds,
    listingSearchParams.dir,
    listingSearchParams.limit,
    listingSearchParams.page,
    listingSearchParams.sortBy,
  ]);

  useEffect(() => {
    (async () => await getAllListings())();
  }, [listingSearchParams, jobPathParam, getAllListings]);

  const handlePaginationChange = (event: React.ChangeEvent, page: number) => {
    listingSearchParams.page = page;
    setListingSearchParams(listingSearchParams);
    (async () => {
      await getAllListings();
    })();
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
                  <ListingCard
                    listing={prop}
                    allowEdit={allowEdit}
                    onSuccessAfterEditingListing={getAllListings}
                  />
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

export default ListingList;
