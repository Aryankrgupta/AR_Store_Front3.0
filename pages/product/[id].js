import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import styled from "styled-components";
import { Product } from "@/models/Product";
import WhiteBox from "@/components/WhitwBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { useContext } from "react"
import { CartContext } from "@/components/CartContext";
import FlyingButton from "@/components/FlyingButton";
import ProductReviews from "@/components/ProductReviews";

const Title = styled.h1`
    font-size:1.5em;
`;

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;
export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext);
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
                <Price>
                &#8377;{product.price?.toLocaleString("en-IN")}
                </Price>
                <div>
                <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />Add to cart
                </FlyingButton>
            </div>
            </PriceRow>
            
          </div>
        </ColWrapper>
        <ProductReviews product={product} />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
