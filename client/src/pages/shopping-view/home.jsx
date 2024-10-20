/* eslint-disable react/jsx-key */
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, FlipHorizontalIcon, KeyIcon, MoonIcon, PlaneTakeoffIcon, UmbrellaIcon, WalletCardsIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";


const categoriesWithIcon = [
  { id: "moonlamp", label: "MoonLamp", icon: MoonIcon },
  { id: "walldecor", label: "WallDecor", icon: WalletCardsIcon },
  { id: "keychain", label: "Keychain", icon: KeyIcon },
  { id: "flipname", label: "Flipname", icon: FlipHorizontalIcon },
  { id: "nameplate", label: "NamePlate", icon: PlaneTakeoffIcon },
  { id: "numberplate", label: "NumberPlate", icon: UmbrellaIcon },
];


function ShoppingHome() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
    }, 3000)

    return () => clearInterval(timer);
  }, [featureImageList])


  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
  }, [dispatch])

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // console.log(productList, "productList");

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id]
    }

    sessionStorage.setItem("filters", JSON.stringify(currentFilter))
    navigate("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {


    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }


    console.log(getCurrentProductId);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
    if(!user?.id){
      alert("login to continue");
    }

  }

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])


  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {
          featureImageList && featureImageList.length > 0 ?
            featureImageList.map((slide, index) => (
              <img
                key={index}
                src={slide?.image}
                className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover trasition-opacity duration-1000`}
              />
            )) : null
        }
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentSlide(
            (prevSlide) => ((prevSlide) - 1 + featureImageList.length) % featureImageList.length
          )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentSlide(
            (prevSlide) => (prevSlide + 1) % featureImageList.length
          )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {
              categoriesWithIcon.map((categoryItem) => (
                <Card onClick={() => handleNavigateToListingPage(categoryItem, "category")} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              productList && productList.length > 0 ?
                productList.map(productItem => <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                  product={productItem}
                />
                ) : null
            }
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingHome;