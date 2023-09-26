import React, { useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useCartDrawer, useCartProducts, useNavbar } from "@/store";
import ReviewStars from "@/components/ReviewStars";
import { AiOutlineHeart } from "react-icons/ai";
import { useCart } from "@/hooks/cart";
import {
  useProductRecommendations,
  useSanityProduct,
  useShopifyProduct,
} from "@/hooks/products";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductAccordion from "@/components/ProductAccordion";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductVariantSelector from "@/components/ProductVariantSelector";
import { useMobileView } from "@/hooks/responsive";

const ProductPage = () => {
  const router = useRouter();

  // @ts-ignore
  const shopifyProductData = useShopifyProduct(router.query.productHandle);
  const sanityProductData = useSanityProduct(router.query.productHandle);
  const { addToCart, cartId } = useCart();
  const { productRecommendations } = useProductRecommendations(
    sanityProductData?.data?.store?.gid
  );
  const { setOpen } = useCartDrawer();
  const { height } = useNavbar();
  const { setProducts, setPrice } = useCartProducts();
  const [quantity, setQuantity] = useState(1);
  const { isMobile } = useMobileView();

  const hasAccordions = sanityProductData?.data?.productAccordions?.length > 0;
  const hasOptions =
    shopifyProductData?.data?.product?.variants?.nodes?.length > 1;

  const handleAddToCart = async () => {
    // @ts-ignore
    const queryVariant = decodeURIComponent(router.query.variant);
    const variantId = shopifyProductData?.data?.product?.variants?.nodes?.find(
      (variant) => variant.title === queryVariant
    );

    const productId =
      variantId?.id || sanityProductData?.data?.store?.variants[0]?.store?.gid;
    const response = await addToCart(cartId, productId, quantity);
    setProducts(response?.data?.cartLinesAdd?.cart?.lines?.nodes);
    setPrice(response?.data?.cartLinesAdd?.cart?.cost?.subtotalAmount?.amount);
    setOpen(true);
  };

  return (
    <Box maxW="2560px" m="0 auto">
      <NavBar dataN={{ isBlackNavBar: true }} />
      <Box h={`${height}px`} bg="white" w="100%" />
      <Flex
        alignItems="center"
        pl={isMobile ? "20px" : "145px"}
        pr={isMobile ? "20px" : "145px"}
        h="50px"
        bg="#E7D4C7"
        w="100%"
      >
        <BreadCrumbs
          productTitle={sanityProductData?.data?.store?.title}
          productCollection={
            shopifyProductData?.data?.product?.collections?.nodes[0]
          }
        />
      </Flex>

      <Box
        my="6"
        pl={isMobile ? "20px" : "145px"}
        pr={isMobile ? "20px" : "145px"}
      >
        <Flex gap={6} flexDirection={isMobile ? "column" : "row"}>
          <Box w={isMobile ? "100%" : "50%"}>
            <img
              style={{ position: "sticky", top: "86px" }}
              src={sanityProductData?.data?.store?.previewImageUrl}
              alt={sanityProductData?.data?.store?.title}
            />
          </Box>
          <Flex w={isMobile ? "100%" : "50%"} gap={3} direction="column">
            <Text fontSize={isMobile ? "xl" : "2xl"} fontWeight={700}>
              {sanityProductData?.data?.store?.title}
            </Text>
            <Text fontSize="xl" fontWeight="500">
              ${sanityProductData?.data?.store?.variants[0]?.store?.price}
            </Text>

            <ReviewStars rating={4} />

            <Text
              fontSize={isMobile ? "md" : "lg"}
              fontWeight="400"
              dangerouslySetInnerHTML={{
                __html: sanityProductData?.data?.store?.descriptionHtml,
              }}
              style={{ listStylePosition: "inside" }}
            />

            {/* Variant options */}

            <div>
              {hasOptions && (
                <ProductVariantSelector
                  variants={shopifyProductData?.data?.product?.variants?.nodes}
                />
              )}
            </div>

            <Flex gap={isMobile ? 1 : 8} alignItems="center">
              <Flex alignItems="center" gap={3}>
                <Button
                  onClick={() =>
                    setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)
                  }
                  bg="#00AA4F"
                  size="sm"
                  color="white"
                  rounded="full"
                  _hover={{ opacity: 0.8 }}
                >
                  -
                </Button>
                <Text fontSize="xl" fontWeight="500">
                  {quantity}
                </Text>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  bg="#00AA4F"
                  size="sm"
                  color="white"
                  rounded="full"
                  _hover={{ opacity: 0.8 }}
                >
                  +
                </Button>
              </Flex>
              <Button
                onClick={handleAddToCart}
                bg="#00AA4F"
                color="white"
                rounded="full"
                _hover={{ opacity: 0.8 }}
              >
                AGREGAR AL CARRITO
              </Button>
              <Button
                p={0}
                bg="transparent"
                color="grey"
                _hover={{ color: "#00AA4F" }}
              >
                <AiOutlineHeart size={40} />
              </Button>
            </Flex>

            {hasAccordions && (
              <ProductAccordion
                accordions={sanityProductData?.data?.productAccordions}
              />
            )}
          </Flex>
        </Flex>
        <ProductRecommendations products={productRecommendations} />
      </Box>

      <Footer />
    </Box>
  );
};

export default ProductPage;
