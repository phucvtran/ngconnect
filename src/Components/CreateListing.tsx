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
    event.preventDefault();
    console.log(createObj);
    let message = "";
    if (
      createObj.endDate &&
      new Date(createObj.startDate) > new Date(createObj.endDate)
    ) {
      message += "End date must be after the start date.";
    }
    if (message.length) {
      setWarning(message);
      return;
    }
    const response = await apiAgent.Listings.createJob(createObj);

    const listingId = (response as any)?.listing?.id;
    window.notify("success", response?.message);
    listingId ? navigate(`/listings/${listingId}`) : navigate("/");
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

  const handleNumberInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (Number.isNaN(Number(value))) {
      return;
    }

    setCreateObj({
      ...createObj,
      [name]: Number(value),
    });
  };
  return (
    <Container>
      <FormWrapper>
        <form className="CreateJobForm" onSubmit={createJob}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            Looking for a Job
          </Typography>
          <TextField
            label="Job Title"
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange(e)}
            required
            size="small"
            name="title"
            value={createObj.title}
          />
          <Typography sx={{ marginBottom: 1, color: "#00000099" }}>
            Rate per hour
          </Typography>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 3 }}>
            <TextField
              type="number"
              label="Min"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => handleNumberInputChange(e)}
              required
              size="small"
              name="minRate"
              value={createObj.minRate}
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
            />
            <TextField
              label="Max (optional)"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => handleNumberInputChange(e)}
              size="small"
              name="maxRate"
              value={createObj.maxRate}
              placeholder="$"
              type="number"
              slotProps={{
                htmlInput: {
                  min: createObj.minRate + 1,
                },
              }}
            />
          </Stack>
          <Typography sx={{ marginBottom: 1, color: "#00000099" }}>
            Availability
          </Typography>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start "
                minDate={dayjs()}
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
                label="End (optional)"
                minDate={dayjs()}
                value={createObj.endDate ? dayjs(createObj.endDate) : null}
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
              size="small"
              name="state"
              value={createObj.state}
              sx={{ mb: 2 }}
              required
              fullWidth
            />

            <TextField
              label="Zipcode"
              onChange={handleInputChange}
              size="small"
              name="zipcode"
              value={createObj.zipcode}
              sx={{ mb: 2 }}
              required
              fullWidth
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
  max-width: 90%;
  margin: 0px 30px;
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
