import Featured from "@/components/Featured"
import Header from "@/components/Header"
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Setting } from "@/models/Setting";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]";


export default function Home({product, newProducts, wishedNewProducts}) {
  console.log({newProducts});
  return (
    <div>
      <Header />
      <Featured product={product} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const featuredProductSetting = await Setting.findOne({name: 'featuredProdductId'});
  const featuredProductId = featuredProductSetting.value;
  await mongooseConnect();
  const product = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  const session = await getServerSession(ctx.req, ctx.res, authOption);
  const wishedNewProducts = session?.user ? await WishedProduct.find({
    userEmail: session.user.email,
    product: newProducts.map(p => p._id.toString()),
  }) : [];
  return {
    props: {
      product:JSON.parse(JSON.stringify(product)),
      newProducts:JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
    }
    
  }
}
