// import {ScaleLoader} from "react-spinners";
import styled from "styled-components";
import { ScaleLoader, ClipLoader} from "react-spinners";

const Wrapper = styled.div`
  ${props => props.fullWidth ? `
    display:block;
    display:flex;
    justify-content:center;
  ` : `
    border: 5xp solid blue;
  `}
`;
export default function Spinner({ fullWidth, type }) {
  if (fullWidth && type === 'pay') {
    return (
        <div className="w-full flex justify-center">
          <ClipLoader color="#fff" size={15} />
        </div>
    );
  } else {
    return (
      <Wrapper fullWidth={fullWidth}>
        <ScaleLoader speedMultiplier={3} color={'#555'} />
      </Wrapper>
    );
  }
}
