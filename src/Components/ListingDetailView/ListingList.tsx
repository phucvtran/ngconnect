import { Box, Container, IconButton, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Pagination from "@mui/material/Pagination";
import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListingCard from "./ListingCard";
import { PaginationResponse } from "../../utils/commonTypes";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { colors } from "../../style/styleVariables";
import { defaultQueryParams } from "../../utils/defaultValues";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ModalContainer } from "../ModalContainer";
import Login from "../Authentication/Login";
import Register from "../Authentication/Register";

interface Props {
  getListingsCallback: Function;
  allowEdit?: boolean;
}
const ListingList = ({ getListingsCallback, allowEdit = false }: Props) => {
  const isLargeScreen = useMediaQuery("(min-width:500px)");
  const navigate = useNavigate();

  const isAuthenticate = useSelector(
    (state: RootState) => state.user.refreshToken
  );
  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] =
    React.useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams(defaultQueryParams);
  const [searchInput, setSearchInput] = useState<string>("");
  const [listings, setListings] = useState<PaginationResponse>();

  const getAllListings = useCallback(async () => {
    // build params for API
    let searchQueryParams: string = `limit=${
      searchParams.get("limit") || defaultQueryParams.limit
    }&page=${searchParams.get("page") || defaultQueryParams.page}&dir=${
      searchParams.get("dir") || defaultQueryParams.dir
    }&sortBy=${searchParams.get("sortBy") || defaultQueryParams.sortBy}`;

    if (searchParams.get("categoryId")) {
      searchQueryParams += "&categoryId=" + searchParams.get("categoryId");
    }

    if (searchParams.get("search")) {
      searchQueryParams += "&search=" + searchParams.get("search");
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
  }, [getListingsCallback, searchParams]);

  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
    (async () => await getAllListings())();
  }, [searchParams, getAllListings]);

  // update param in URL
  const updateParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  // handle search button event
  const handleSearchClick = () => {
    updateParams("search", searchInput);
  };

  // press enter to trigger search button
  const handleEnterClick = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handlePaginationChange = (event: React.ChangeEvent, page: number) => {
    updateParams("page", page + "");
    (async () => {
      await getAllListings();
    })();
  };

  const handlePostButtonClick = () => {
    if (!isAuthenticate) {
      setShowLoginModal(true);
    } else {
      navigate("/updateCreateListing");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
      <Container maxWidth="xl">
        <SearchPostContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search Input"
              isLargeScreen={isLargeScreen}
              value={searchInput}
              onKeyDown={(event) => {
                handleEnterClick(event);
              }}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
            ></SearchInput>
            <select
              style={{ border: "none", margin: "15px", fontSize: "medium" }}
              onChange={(event) => {
                updateParams("categoryId", event.target.value);
              }}
            >
              <option value="">All</option>
              <option value="1">Job</option>
              <option value="0">For Sale</option>
            </select>
            <IconButton onClick={handleSearchClick}>
              <SearchIcon
                aria-label="search"
                fontSize="large"
                sx={{
                  color: colors.white,
                  backgroundColor: colors.primary,
                  borderRadius: "50%",
                  padding: "5px",
                }}
              ></SearchIcon>
            </IconButton>
          </SearchContainer>
          <PostButton
            onClick={() => {
              handlePostButtonClick();
            }}
          >
            Create Post
          </PostButton>
        </SearchPostContainer>

        <SearchCategoryContainer>
          <CategoryButton style={{ fontWeight: "bold", color: colors.primary }}>
            Jobs
          </CategoryButton>
          <CategoryButton>Vehicles</CategoryButton>
          <CategoryButton>Electronics</CategoryButton>
          <CategoryButton>Media</CategoryButton>
          <CategoryButton>Garden</CategoryButton>
          <CategoryButton>Clothing</CategoryButton>
          <CategoryButton>Shoe</CategoryButton>
          <CategoryButton>Baby & Kids</CategoryButton>
          <CategoryButton>Game & Toys</CategoryButton>
          <CategoryButton>More</CategoryButton>
        </SearchCategoryContainer>
      </Container>
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
                  <ListingCard listing={prop} allowEdit={allowEdit} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>

      {/* pagination container  */}
      <Container
        className="pagination-container"
        maxWidth="xl"
        sx={{ margin: "30px 0" }}
      >
        <Pagination
          size="large"
          count={listings?.totalPages}
          showFirstButton
          showLastButton
          onChange={(e: any, page: number) => handlePaginationChange(e, page)}
        />
      </Container>

      {/* login/register modal */}
      {showLoginModal ? (
        <ModalContainer
          content={
            <Login
              onSuccessLogin={setShowLoginModal}
              onRegisterClick={setShowRegisterModal}
              navigateUrl="/updateCreateListing"
            />
          }
          onClose={() => {
            setShowLoginModal(false);
          }}
          open={showLoginModal}
          title="Sign Up / Log in"
        />
      ) : null}

      {showRegisterModal ? (
        <ModalContainer
          content={
            <Register
              onLoginClick={setShowLoginModal}
              onRegisterSuccessful={setShowRegisterModal}
            />
          }
          onClose={() => {
            setShowRegisterModal(false);
          }}
          open={showRegisterModal}
          title="Sign Up / Log in"
        />
      ) : null}
    </Container>
  );
};

export default ListingList;

const SearchPostContainer = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  margin: auto;
  justify-content: center;
  justify-content: center;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  margin: auto;
  justify-content: center;
  justify-content: center;
  border-radius: 20px;
  border: 2px solid ${colors.darkGray};
`;

const SearchInput = styled.input<{ isLargeScreen: boolean }>`
  border: none;
  margin: 15px;
  width: ${(props) => (props.isLargeScreen ? "200px" : "auto")};
  outline: none;
  font-size: medium;
`;

const PostButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: medium;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  margin: 10px 0;
  cursor: pointer;
`;

const SearchCategoryContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  justify-content: center;
  padding: 15px 0;
  border-bottom: 1px solid ${colors.lightGray};
`;

const CategoryButton = styled.button`
  height: 50px;
  background-color: ${colors.white};
  border: none;
  font-size: large;
  cursor: pointer;
  :hover {
    border-bottom: 3px solid ${colors.primary};
  }
`;
