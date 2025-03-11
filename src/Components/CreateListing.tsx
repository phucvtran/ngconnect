import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../models/Listing";
import { colors } from "../style/styleVariables";
import apiAgent from "../utils/apiAgent";
import UpdateCreateListingForm from "./UpdateCreateListingForm";
import { useNavigate } from "react-router-dom";

const emptyJob: UpdateCreateJobListingDto = {
  minRate: 0,
  startDate: new Date(),
  title: "",
  description: "",
  price: 0,
  categoryId: 1,
  city: "",
  state: "",
  zipcode: "",
};

export default function CreateListing() {
  const navigate = useNavigate();
  const apiCallback = async (
    request: UpdateCreateJobListingDto | UpdateCreateListingDto
  ) => {
    return request.categoryId === 1
      ? await apiAgent.Listings.createJob(request as UpdateCreateJobListingDto)
      : await apiAgent.Listings.createListing(
          request as UpdateCreateListingDto
        );
  };

  const onSuccess = (listingType: number, listingId: string) => {
    listingId
      ? navigate(`/listings${listingType === 1 ? "/jobs" : ""}/${listingId}`)
      : navigate("/myPost");
  };

  return (
    <Container>
      <UpdateCreateListingForm
        initialObject={emptyJob}
        apiCallback={apiCallback}
        onSuccess={onSuccess}
      />
    </Container>
  );
}

const Container = styled.div`
  justify-content: center;
  display: flex;
  /* height: 92vh; */
  align-items: center;
  max-width: 100%;
  margin: 30px;
`;
