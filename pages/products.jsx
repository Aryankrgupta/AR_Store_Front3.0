import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductGrid";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import styled from "styled-components";
import { authOption } from "./api/auth/[...nextauth]";

const Title = styled.h1`
  font-size: 1.5em;
`;

export default function Products({ products, wishedProducts }) {
  return (
    <>
      <Header />
      <Center> 
        <Title>All Products</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const session = await getServerSession(ctx.req, ctx.res, authOption);
  const wishedProducts = session?.user ? await WishedProduct.find({
    userEmail: session.user.email,
    product: products.map(p => p._id.toString()),
  }) : [];
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    },
  };
}
