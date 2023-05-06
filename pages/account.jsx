import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import WhiteBox from "@/components/WhitwBox";
import { useSession, signOut, signIn } from "next-auth/react";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function Account() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders')
  const [orders, setOrders] = useState([]);
  const [orderLoaded, setOrderLoaded] = useState(true);
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function login() {
    await signIn("google");
  }
  function saveAddress() {
    const data = { name, email, city, address, pinCode, country };
    axios.put("/api/address", data);
  }
  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);
    setTimeout(() => {
      axios.get("/api/address").then((response) => {
        setName(response?.data?.name);
        setEmail(response?.data?.email);
        setCity(response?.data?.city);
        setPinCode(response?.data?.pinCode);
        setAddress(response?.data?.address);
        setCountry(response?.data?.country);
        setAddressLoaded(true);
      });
    }, 1000);
    axios.get("/api/wishlist").then((response) => {
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishlistLoaded(true);
    });
    axios.get('/api/order').then(response => {
      setOrders(response.data);
      setOrderLoaded(true);
    })

  }, [session]);
  function productRemovedFromWishlist(_id) {
    setWishedProducts(products => {
      return [...products.filter(p => p._id.toString() !== _id)];
    })
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs tabs={['Orders','Wishlist']} active={activeTab} onChange={setActiveTab} />
                {activeTab === 'Orders' && (
                  <>
                    {!orderLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {orderLoaded && (
                      <div>
                        {!session && orders.length === 0 && (
                          <p>Login to see the orders</p>
                        )}
                        {session && orders.length === 0 && (
                          <p>Buy your first product from our shop.</p> 
                        )}
                        {orders.length > 0 && orders.map(o => (
                          <SingleOrder {...o} />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'Wishlist' && (
                  <>
                    {!wishlistLoaded && (
                  <Spinner fullWidth={true} />
                )}
                {wishlistLoaded && (
                  <>
                    <WishedProductsGrid>
                  {wishedProducts.length > 0 &&
                    wishedProducts.map((wp) => (
                      <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} />
                    ))}
                </WishedProductsGrid>
                {wishedProducts.length === 0 && (
                      <>
                      {session && (
                        <p>Your wishlist is empty.</p>
                      )}
                      {!session && (
                        <p>Login to add products to your wishlist.</p>
                      )}
                      </>
                    )}
                  </>
                )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>{session ? 'Account Details' : 'Login'}</h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      name="name"
                      onChange={(ev) => setName(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      name="email"
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(ev) => setCity(ev.target.value)}
                        name="city"
                      />
                      <Input
                        type="text"
                        placeholder="Pin Code"
                        value={pinCode}
                        onChange={(ev) => setPinCode(ev.target.value)}
                        name="pinCode"
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(ev) => setAddress(ev.target.value)}
                      name="address"
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(ev) => setCountry(ev.target.value)}
                      name="country"
                    />
                    <Button block black onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}
                {session && (
                  <Button primary onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary onClick={login}>
                    login with google
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
