import { useState } from "react";
import styledComponents from "styled-components";

const Image = styledComponents.img`
    max-width:100%;
    max-height:100%;
`;
const ImageButtons = styledComponents.div`
    display:flex;
    gap:10px;
    flex-grow:0;
    margin-top:10px;
`;
const BigImage = styledComponents.img`
    max-width:100%;
    max-height:300px;
`;
const ImageButton = styledComponents.div`
    border: 2px solid #aaa;
    ${props => props.active ? `
        border-color:#ccc;
     `: `
        border-color: transparent;
        opacity:0.7;
    `}
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius:5px;
`;
const BigImageWrapper = styledComponents.div`
    text-aline:center;
`;
export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  return (
    <>
    <BigImageWrapper>
      <BigImage src={activeImage} alt="" />
    </BigImageWrapper>
      <ImageButtons>
        {images.map((image) => (
          <ImageButton active={activeImage === image} onClick={() => setActiveImage(image)}>
            <Image src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
