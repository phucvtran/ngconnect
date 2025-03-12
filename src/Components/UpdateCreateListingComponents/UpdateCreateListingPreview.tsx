import styled from "@emotion/styled";
import { colors } from "../../style/styleVariables";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UpdateCreateJobListingDto } from "../../models/Listing";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import avatar_image from "../../Assets/Images/img_avatar.png";

import ImageSlider from "../ListingDetailView/ImageSlider";
import { currencyFormat } from "../../utils/helperMethods";

interface props {
  images: string[];
  listing: UpdateCreateJobListingDto;
}

const UpdateCreateListingPreview = ({ images, listing }: props) => {
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const currentUser = useSelector((state: RootState) => state.user.userInfo);

  return (
    <PreviewContainer isLargeScreen={isLargeScreen}>
      <h3 className="preview-title">Preview</h3>
      <Preview isLargeScreen={isLargeScreen}>
        {images.length > 0 ? (
          <ImageSliderContainer isLargeScreen={isLargeScreen}>
            <ImageSlider images={images}></ImageSlider>
          </ImageSliderContainer>
        ) : (
          <ImageSliderContainer isLargeScreen={isLargeScreen}>
            <ImageSlider images={images}></ImageSlider>
          </ImageSliderContainer>
        )}
        <ListingInfoContainer isLargeScreen={isLargeScreen}>
          <h3>{listing.title || "Title"}</h3>
          <h4>
            {listing.categoryId === 1
              ? currencyFormat(listing.minRate) +
                (listing.maxRate
                  ? "-" + currencyFormat(listing.maxRate) + " /hour"
                  : "/hours")
              : currencyFormat(listing?.price) || "Price"}
          </h4>
          <p>{listing.categoryId === 1 ? "Job" : "For Sale"}</p>
          <p>a few second ago</p>
          <p>{listing.city || currentUser.city}</p>
          <br />
          <h4>Details</h4>
          <p>{listing.description || "Description of your item/service/job"}</p>
          <hr />
          <h3>User Infomation</h3>
          <div className="user-info">
            <div>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
                src={avatar_image}
              ></img>
            </div>
            &nbsp; &nbsp;
            <strong>
              {currentUser.firstName + " " + currentUser.lastName}
            </strong>
          </div>
        </ListingInfoContainer>
      </Preview>
    </PreviewContainer>
  );
};

export default UpdateCreateListingPreview;

const PreviewContainer = styled.div<{ isLargeScreen: boolean }>`
  width: ${(props) => (props.isLargeScreen ? "66%" : "100%")};
  border: 2px solid ${colors.primary};
  border-radius: 25px;
  h3.preview-title {
    margin: 20px 10px 0px 20px;
  }
`;

const Preview = styled.div<{ isLargeScreen: boolean }>`
  display: ${(props) => (props.isLargeScreen ? "flex" : "inline-block")};
  margin: 10px;
  width: ${(props) => (props.isLargeScreen ? "97%" : "94%")};
  height: 92%;
  background-color: ${colors.lightGray};
  border-radius: 25px;
`;

const ImageSliderContainer = styled.div<{ isLargeScreen: boolean }>`
  display: inline-block;
  margin: ${(props) => (props.isLargeScreen ? "auto" : "20px 0 0 0")};
  width: ${(props) => (props.isLargeScreen ? "58%" : "100%")};
`;

const ListingInfoContainer = styled.div<{ isLargeScreen: boolean }>`
  display: inline-block;
  width: ${(props) => (props.isLargeScreen ? "40%" : "100%")};
  border-left: ${(props) =>
    props.isLargeScreen ? "1px solid" + colors.darkGray : "none"};
  border-top: ${(props) =>
    props.isLargeScreen ? "none" : "1px solid" + colors.darkGray};
  padding: ${(props) => (props.isLargeScreen ? "0 0 0 10px" : "10px 0 0 0")};
  opacity: 0.6;

  div.user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
  }
`;
// end template style
