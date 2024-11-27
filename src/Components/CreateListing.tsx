import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { UpdateCreateJobListingDto } from "../models/Listing";
import { colors } from "../style/styleVariables";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import apiAgent from "../utils/apiAgent";

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
  const [createObj, setCreateObj] =
    useState<UpdateCreateJobListingDto>(emptyJob);
  const [warning, setWarning] = useState<string>("");
  const navigate = useNavigate();

  const createJob = async (event: any) => {
    const response = await apiAgent.Listings.createJob(createObj);
    console.log(response?.message);
    navigate("/");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setCreateObj({
      ...createObj,
      [name]: value !== "" ? value : null,
    });
  };

  return (
    <Container>
      <FormWrapper>
        <form className="SignInForm" onSubmit={createJob}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            Looking for a Job
          </Typography>
          <TextField
            label="Job Title"
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange(e)}
            required
            variant="outlined"
            color="secondary"
            size="small"
            fullWidth
            name="title"
            value={createObj.title}
          />
          <Typography sx={{ marginBottom: 1, color: "#00000099" }}>
            Rate per hour
          </Typography>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 3 }}>
            <TextField
              label="Min"
              sx={{ mb: 2 }}
              onChange={(e) => handleInputChange(e)}
              required
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              name="minRate"
              value={createObj.minRate}
              defaultValue={null}
            />
            <TextField
              label="Max (optional)"
              sx={{ mb: 2 }}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              name="maxRate"
              value={createObj.maxRate}
              placeholder="$"
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start available date"
                value={dayjs(createObj.startDate)}
                onChange={(newValue) =>
                  newValue &&
                  setCreateObj({ ...createObj, startDate: newValue.toDate() })
                }
                slotProps={{
                  textField: {
                    required: true,
                    size: "small",
                    sx: { mb: 2 },
                  },
                }}
              />
              <DatePicker
                label="End available date"
                value={dayjs(createObj.endDate)}
                onChange={(newValue) =>
                  newValue &&
                  setCreateObj({ ...createObj, endDate: newValue.toDate() })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { mb: 2 },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>

          <TextField
            label="Description"
            onChange={(e) => handleInputChange(e)}
            required
            sx={{ mb: 2 }}
            size="small"
            name="description"
            value={createObj.description}
            multiline
            rows={6}
            helperText="Provide a concise introduction or experience (max 500 characters)"
          />

          <TextField
            label="City"
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            name="city"
            value={createObj.city}
            sx={{ mb: 2 }}
            required
          />
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <TextField
              label="State"
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              name="state"
              value={createObj.state}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Zipcode"
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              name="zipcode"
              value={createObj.zipcode}
              sx={{ mb: 2 }}
              required
            />
          </Stack>

          {warning.length ? (
            <p style={{ color: "red", maxWidth: "460px" }}>{warning}</p>
          ) : null}
          <Button variant="contained" type="submit">
            Create
          </Button>
        </form>
      </FormWrapper>
    </Container>
  );
}

const Container = styled.div`
  justify-content: center;
  display: flex;
  height: 92vh;
  align-items: center;
`;
const FormWrapper = styled.div`
  border: 2px solid ${colors.primary};
  border-radius: 25px;
  display: flex;
  justify-content: center;

  form {
    display: grid;
    padding: 20px;
  }
`;
