import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import StarsRating from "./StarsRating";
import Textarea from "./Textarea";
import WhiteBox from "./WhitwBox";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;
const Subtitle = styled.h3`
  font-size: 1rem;
  margin-top: 5px;
`;
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;
const ReviewWrapper = styled.div`
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  padding: 10px 0;
  h3 {
    margin: 3px 0;
    font-size: 1rem;
    color: #333;
    font-weight: normal;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    line-height: 1rem;
    color: #555;
  }
`;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  time {
    font-size: 12px;
    color: #aaa;
  }
`;

export default function ProductReviews({ product }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);

  function submitReview() {
    const data = { title, description, stars, product: product._id };
    axios.post("/api/reviews", data).then((res) => {
      setTitle("");
      setDescription("");
      setStars(0);
      loadReview();
    });
  }
  useEffect(() => {
    loadReview();
  }, []);
  function loadReview() {
    axios.get("/api/reviews?product=" + product._id).then((res) => {
        setReviews(res.data);
      });
  }

  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
      <div>
      <WhiteBox>
          <Subtitle>Add a review</Subtitle>
          <div>
            <StarsRating onChange={setStars} />
          </div>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <Textarea
            placeholder="How was it?"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          <div>
            <Button onClick={submitReview} primary>
              Submit review
            </Button>
          </div>
        </WhiteBox>
      </div>
      <div>
      <WhiteBox>
          <Subtitle>All reviews</Subtitle>
          {reviews.length === 0 && (
            <div>
              No review :(
            </div>
          )}
          {reviews.length > 0 &&
            reviews.map((review) => (
              <ReviewWrapper>
               <ReviewHeader>
               <StarsRating disabled={true} size={'sm'} defaultNoOfStars={review.stars} />
                <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
               </ReviewHeader>
               <h3>{review.title}</h3>
               <p>{review.description}</p>
              </ReviewWrapper>
            ))}
        </WhiteBox>
      </div>
      </ColsWrapper>
    </div>
  );
}
