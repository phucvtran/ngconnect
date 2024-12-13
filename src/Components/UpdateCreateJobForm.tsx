import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UpdateCreateJobListingDto } from "../models/Listing";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {
  initialObject: UpdateCreateJobListingDto;
  apiCallback: Function;
  onSuccess?: Function;
}
const UpdateCreateJobForm = ({
  initialObject,
  apiCallback,
  onSuccess,
}: Props) => {
  const [updateCreateObject, setUpdateCreateObject] =
    useState<UpdateCreateJobListingDto>(initialObject);
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    console.log(initialObject);
  }, [initialObject]);
  const createJob = async (event: any) => {
    event.preventDefault();
    console.log(updateCreateObject);
    let message = "";
    if (
      updateCreateObject.endDate &&
      new Date(updateCreateObject.startDate) >
        new Date(updateCreateObject.endDate)
    ) {
      message += "End date must be after the start date.";
    }
    if (message.length) {
      setWarning(message);
      return;
    }
    // const response = await apiAgent.Listings.createJob(updateCreateObject);
    const response = await apiCallback(updateCreateObject);

    const listingId = (response as any)?.listing?.id;
    window.notify("success", response?.message);
    onSuccess && onSuccess(listingId);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setUpdateCreateObject({
      ...updateCreateObject,
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

    setUpdateCreateObject({
      ...updateCreateObject,
      [name]: Number(value),
    });
  };
  return (
    <div>
      <form className="CreateJobForm" onSubmit={createJob}>
        <TextField
          label="Job Title"
          sx={{ mb: 2 }}
          onChange={(e) => handleInputChange(e)}
          required
          size="small"
          name="title"
          value={updateCreateObject.title}
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
            value={updateCreateObject.minRate}
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
            value={updateCreateObject.maxRate}
            placeholder="$"
            type="number"
            slotProps={{
              htmlInput: {
                min: updateCreateObject.minRate + 1,
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
              value={dayjs(updateCreateObject.startDate)}
              onChange={(newValue) =>
                newValue &&
                setUpdateCreateObject({
                  ...updateCreateObject,
                  startDate: newValue.toDate(),
                })
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
              value={
                updateCreateObject.endDate
                  ? dayjs(updateCreateObject.endDate)
                  : null
              }
              onChange={(newValue) =>
                newValue &&
                setUpdateCreateObject({
                  ...updateCreateObject,
                  endDate: newValue.toDate(),
                })
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
          value={updateCreateObject.description}
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
          value={updateCreateObject.city}
          sx={{ mb: 2 }}
          required
        />
        <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
          <TextField
            label="State"
            onChange={handleInputChange}
            size="small"
            name="state"
            value={updateCreateObject.state}
            sx={{ mb: 2 }}
            required
            fullWidth
          />

          <TextField
            label="Zipcode"
            onChange={handleInputChange}
            size="small"
            name="zipcode"
            value={updateCreateObject.zipcode}
            sx={{ mb: 2 }}
            required
            fullWidth
          />
        </Stack>

        {warning.length ? (
          <p style={{ color: "red", maxWidth: "460px" }}>{warning}</p>
        ) : null}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
export default UpdateCreateJobForm;
