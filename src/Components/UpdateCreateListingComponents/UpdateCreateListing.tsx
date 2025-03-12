import styled from "@emotion/styled";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../../models/Listing";
import apiAgent from "../../utils/apiAgent";
import UpdateCreateListingForm from "./UpdateCreateListingForm";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function UpdateCreateListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const listing = location?.state?.listing;

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
      ? navigate(`/listings${listingType === 1 ? "/jobs" : ""}/${listingId}`, {
          replace: true,
          state: null,
        })
      : navigate("/myPost", { replace: true, state: null });
  };

  return (
    <Container>
      <UpdateCreateListingForm
        initialObject={listing || emptyJob}
        apiCallback={apiCallback}
        onSuccess={onSuccess}
        isUpdate={listing}
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
