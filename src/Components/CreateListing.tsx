import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { UpdateCreateJobListingDto } from "../models/Listing";
import { colors } from "../style/styleVariables";
import apiAgent from "../utils/apiAgent";
import UpdateCreateJobForm from "./UpdateCreateJobForm";
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
  const apiCallback = async (request: UpdateCreateJobListingDto) => {
    return await apiAgent.Listings.createJob(request);
  };
  const onSuccess = (listingId: string) => {
    listingId ? navigate(`/listings/jobs/${listingId}`) : navigate("/");
  };
  return (
    <Container>
      <FormWrapper>
        <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
          Looking for a Job
        </Typography>
        <UpdateCreateJobForm
          initialObject={emptyJob}
          apiCallback={apiCallback}
          onSuccess={onSuccess}
        />
      </FormWrapper>
    </Container>
  );
}

const Container = styled.div`
  justify-content: center;
  display: flex;
  height: 92vh;
  align-items: center;
  max-width: 90%;
  margin: 0px 30px;
`;
const FormWrapper = styled.div`
  border: 2px solid ${colors.primary};
  border-radius: 25px;
  display: block;
  justify-content: center;
  h4 {
    margin: 20px 10px 0px 20px;
  }
  form {
    display: grid;
    padding: 20px;
  }
`;
