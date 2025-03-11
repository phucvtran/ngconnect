import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import imageCompression from "browser-image-compression";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../models/Listing";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { colors } from "../style/styleVariables";
import UpdateCreateListingPreview from "./UpdateCreateListingPreview";
import apiAgent from "../utils/apiAgent";

interface Props {
  initialObject: UpdateCreateJobListingDto;
  apiCallback: Function;
  onSuccess?: Function;
  isUpdate?: boolean;
}
const UpdateCreateListingForm = ({
  initialObject,
  apiCallback,
  onSuccess,
  isUpdate,
}: Props) => {
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const [updateCreateObject, setUpdateCreateObject] =
    useState<UpdateCreateJobListingDto>(() => initialObject);
  const [warning, setWarning] = useState<string>("");
  const [listingType, setListingType] = useState<string>("1");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setUpdateCreateObject(initialObject);
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
    const response = await apiCallback(updateCreateObject, imageFiles);

    const listingId = (response as any)?.listing?.id;

    if (listingId && imageFiles.length > 0) {
      await uploadImage(listingId); // Upload images after creating listing
    }

    window.notify("success", response?.message);
    onSuccess && onSuccess(1, listingId);
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

    const response = await apiCallback(updateCreateListingDto, imageFiles);

    const listingId = (response as any)?.listing?.id;
    if (listingId && imageFiles.length > 0) {
      await uploadImage(listingId); // Upload images after creating listing
    }
    window.notify("success", response?.message);
    onSuccess && onSuccess(0, listingId);
  };

  const uploadImage = async (listingId: string) => {
    if (imageFiles.length === 0) {
      return; // no image to upload
    }

    const formData = new FormData();
    imageFiles.forEach((file) => {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size / 1024 / 1024 + "MB",
      });
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(
          `File ${file.name} exceeds 5MB after compression: ${
            file.size / 1024 / 1024
          }MB`
        );
      }
      formData.append("listingImages", file, file.name);
    });

    try {
      const response = await apiAgent.Listings.uploadListingImage(
        listingId,
        formData
      );
      setImageFiles([]); // Clear files
      setImagePreviews([]); // Clear previews
      window.notify(
        "success",
        "upload image successful for listing: " + listingId
      );
      return response;
    } catch (error) {
      window.notify("error", "failed to upload Image");
    }
  };

  const handleListingTypeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setListingType(event.target.value);

    setUpdateCreateObject((prev) => ({
      ...prev,
      ["categoryId"]: Number(event.target.value),
    }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setUpdateCreateObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (Number.isNaN(Number(value))) {
      return;
    }

    setUpdateCreateObject((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    newValue: dayjs.Dayjs | null
  ) => {
    if (!newValue) return;

    setUpdateCreateObject((prevState) => ({
      ...prevState,
      [field]: newValue.toDate(),
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      const options = {
        maxSizeMB: 5, // Max file size in MB
        maxWidthOrHeight: 1280, // Resize to max 1280 width or height
        useWebWorker: true, // Improve performance
        initialQuality: 0.7,
      };

      try {
        const compressedFiles = await Promise.all(
          files.map(async (file) => {
            if (file.size <= 5 * 1024 * 1024) return file; // Skip if already under 5MB
            const compressedFile = await imageCompression(file, options);
            console.log(
              `Compressed ${file.name}: ${file.size / 1024 / 1024}MB -> ${
                compressedFile.size / 1024 / 1024
              }MB`
            );
            if (compressedFile.size > 5 * 1024 * 1024) {
              setWarning(
                `File ${file.name} still too large after compression: ${
                  compressedFile.size / 1024 / 1024
                }MB`
              );
            }
            return compressedFile;
          })
        );
        setImageFiles(compressedFiles);
        const previewURLs = compressedFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setImagePreviews(previewURLs);
      } catch (error) {
        console.error("Compression error:", error);
        window.notify("error", "compression error");
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = imagePreviews.filter((_, i) => i !== index);
    const newImagesFiles = imageFiles.filter((_, i) => i !== index);
    setImagePreviews(newImages);
    setImageFiles(newImagesFiles);
    URL.revokeObjectURL(imagePreviews[index]); // discard image in the memory.
  };

  return (
    <CreateListingContainer isLargeScreen={isLargeScreen}>
      <FormWrapper isLargeScreen={isLargeScreen}>
        <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
          Post A Listing:
        </Typography>
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
                  handleListingTypeChange(event);
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

          {/* start dev image upload UI  */}
          <div>
            {/* Upload photo button */}
            <Button
              sx={{ marginBottom: "20px" }}
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload Images
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileSelect}
                multiple
              />
            </Button>

            {/* Preview small*/}
            {imagePreviews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    {/* remove image button  */}
                    <button
                      name="removeImage"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: colors.red,
                        color: colors.white,
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* dev image upload UI  */}

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
                    pattern: "[0-9]*",
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
                slotProps={{
                  htmlInput: {
                    min: updateCreateObject.minRate + 1,
                    pattern: "[0-9]*",
                  },
                }}
              />
            </Stack>
          ) : (
            <TextField
              label="Price"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => handleNumberInputChange(e)}
              required
              size="small"
              name="price"
              value={updateCreateObject.price}
              placeholder="$0"
              slotProps={{
                htmlInput: {
                  price: 0,
                  pattern: "[0-9]*",
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
                      handleDateChange("startDate", newValue)
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
      </FormWrapper>

      <UpdateCreateListingPreview
        images={imagePreviews}
        listing={updateCreateObject}
      ></UpdateCreateListingPreview>
    </CreateListingContainer>
  );
};
export default UpdateCreateListingForm;

const CreateListingContainer = styled.div<{ isLargeScreen: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isLargeScreen ? "row" : "column")};
  gap: 25px;
  width: 100%;
`;

const FormWrapper = styled.div<{ isLargeScreen: boolean }>`
  border: 2px solid ${colors.primary};
  border-radius: 25px;
  display: block;
  width: ${(props) => (props.isLargeScreen ? "33%" : "100%")};
  justify-content: center;
  h4 {
    margin: 20px 10px 0px 20px;
  }
  form {
    display: grid;
    padding: 20px;
  }
`;

const VisuallyHiddenInput = styled.input`
  clip: "rect(0 0 0 0)";
  clip-path: inset(50%);
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1;
`;
