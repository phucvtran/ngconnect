import styled from "@emotion/styled";
import { useState } from "react";
import { colors } from "../style/styleVariables";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../models/Listing";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import avatar_image from "../Assets/Images/img_avatar.png";
import { currencyFormat } from "../utils/helperMethods";

interface props {
  images: string[];
  listing: UpdateCreateJobListingDto;
}

const UpdateCreateListingPreview = ({ images, listing }: props) => {
  const isLargeScreen = useMediaQuery("(min-width:500px)");

  const currentUser = useSelector((state: RootState) => state.user.userInfo);
  const [imageIndex, setImageIndex] = useState<number>(0);

  const handlePreviousButton = () => {
    if (imageIndex === 0) {
      setImageIndex(images.length - 1);
    } else {
      setImageIndex(imageIndex - 1);
    }
  };

  const handleNextButton = () => {
    if (imageIndex === images.length - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex + 1);
    }
  };

  return (
    <PreviewContainer isLargeScreen={isLargeScreen}>
      <h3 className="preview-title">Preview</h3>
      <Preview isLargeScreen={isLargeScreen}>
        {images.length > 0 ? (
          <ImageSliderContainer isLargeScreen={isLargeScreen}>
            <ImageContainer>
              <a className="button-previous" onClick={handlePreviousButton}>
                ❮
              </a>
              <img style={{ width: "100%" }} src={images[imageIndex]}></img>
              <a className="button-next" onClick={handleNextButton}>
                ❯
              </a>
            </ImageContainer>
            <DotPaginationContainer>
              {images.map((_, i) => {
                return (
                  <span
                    key={i}
                    className={i === imageIndex ? "dot active" : "dot"}
                    onClick={() => setImageIndex(i)}
                  ></span>
                );
              })}
            </DotPaginationContainer>
          </ImageSliderContainer>
        ) : (
          <ImageSliderContainer isLargeScreen={isLargeScreen}>
            <h4 style={{ textAlign: "center", opacity: 0.6 }}>
              Your Images Preview
            </h4>
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
const ImageContainer = styled.div`
  width: 90%;
  margin: auto;
  position: relative;

  .button-previous,
  .button-next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    width: auto;
    padding: 16px;
    margin-top: -22px;
    color: ${colors.primary};
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 0 3px 3px 0;
    user-select: none;
  }

  /* Position the "next button" to the right */
  .button-next {
    right: 0;
    border-radius: 3px 0 0 3px;
  }

  /* On hover, add a black background color with a little bit see-through */
  .button-previous:hover,
  .button-next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* Fading animation */
  .fade {
    animation-name: fade;
    animation-duration: 1.5s;
  }

  @keyframes fade {
    from {
      opacity: 0.4;
    }
    to {
      opacity: 1;
    }
  }
`;

const DotPaginationContainer = styled.div`
  margin-top: 10px;
  text-align: center;

  /* The dots/bullets/indicators */
  .dot {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: ${colors.lightBlue};
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
  }

  .active,
  .dot:hover {
    background-color: ${colors.primary};
  }
`;
