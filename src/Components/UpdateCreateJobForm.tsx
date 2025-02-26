import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../models/Listing";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {
  initialObject: UpdateCreateJobListingDto;
  apiCallback: Function;
  onSuccess?: Function;
  isUpdate?: boolean;
}
const UpdateCreateJobForm = ({
  initialObject,
  apiCallback,
  onSuccess,
  isUpdate,
}: Props) => {
  const [updateCreateObject, setUpdateCreateObject] =
    useState<UpdateCreateJobListingDto>(initialObject);
  const [warning, setWarning] = useState<string>("");
  const [listingType, setListingType] = useState<string>("1");

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

  const createListing = async (event: any) => {
    event.preventDefault();
    const updateCreateListingDto: UpdateCreateListingDto = {
      title: updateCreateObject.title,
      categoryId: Number(listingType),
      price: updateCreateObject.price,
      description: updateCreateObject.description,
      city: updateCreateObject.city,
      state: updateCreateObject.state,
      zipcode: updateCreateObject.zipcode,
    };

    const response = await apiCallback(updateCreateListingDto);

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
    console.log(updateCreateObject);
  };
  return (
    <div>
      <form
        className="CreateJobForm"
        onSubmit={listingType === "1" ? createJob : createListing}
      >
        {isUpdate ? null : (
          <FormControl sx={{ marginBottom: "20px" }}>
            <RadioGroup
              row
              name="radio-button-group-create-listing"
              value={listingType}
              onChange={(event) => {
                setListingType(event.target.value);
              }}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Service/Job"
              />
              <FormControlLabel value="0" control={<Radio />} label="Item" />
            </RadioGroup>
          </FormControl>
        )}

        <TextField
          label={listingType === "1" ? "Job Title" : "Listing Title"}
          sx={{ mb: 2 }}
          onChange={(e) => handleInputChange(e)}
          required
          size="small"
          name="title"
          value={updateCreateObject.title}
        />
        <Typography sx={{ marginBottom: 1, color: "#00000099" }}>
          {listingType === "1" ? "Rate per hour" : "Price ($USD)"}
        </Typography>
        {listingType === "1" ? (
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
        ) : (
          <TextField
            type="number"
            label="Price"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => handleNumberInputChange(e)}
            required
            size="small"
            name="price"
            value={updateCreateObject.price}
            slotProps={{
              htmlInput: {
                price: 0,
              },
            }}
          />
        )}
        {listingType === "1" ? (
          <div>
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
          </div>
        ) : null}

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
