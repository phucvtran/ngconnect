import styled from "@emotion/styled";
import { useState } from "react";
import { colors } from "../../style/styleVariables";
interface prop {
  images: string[];
}
const ImageSlider = ({ images }: prop) => {
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
  return images.length > 0 ? (
    <>
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
    </>
  ) : (
    <h4 style={{ textAlign: "center", opacity: 0.6 }}>Your Images Preview</h4>
  );
};

export default ImageSlider;

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
