import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
  Box,
  Flex,
  Grid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useNavbar, useStore } from "@/store";
import { client } from "@/lib/sanity.client";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/typesSanity/shopify";
import { ICollectionPageData } from "@/typesSanity/docs/collectionPage";
import PortableText from "@/components/PortableText";
import ComponentRenderer from "@/components/ComponentRenderer";
import { useAllProducts } from "@/hooks/collections";
import { useRouter } from "next/router";
import TagSelector from "@/components/TagSelector";
import CollectionsSelector from "@/components/CollectionsSelector";
import SortSelector from "@/components/SortSelector";
import { getOrderTag } from "@/utils";

const AllCollectionsPage = () => {
  const router = useRouter();
  // @ts-ignore
  const queryTags = decodeURIComponent(router?.query?.tags);
  const queryTagsArray = queryTags
    ?.split(",")
    .filter((tag: string) => tag != "undefined" && tag != "");
  const gqlQueryTags = queryTagsArray
    ?.map((tag: string) => `(tag:${tag})`)
    .join(" OR ");
  // @ts-ignore
  const sortKey = router.query?.sort?.toUpperCase();
  const order = router.query?.order === "true";
  const { height } = useNavbar();
  const { value } = useStore();
  const [isMobile] = useMediaQuery(`(max-width: ${value})`);
  const [collectionData, setCollectionData] = useState<ICollectionPageData>();
  const allProductsData = useAllProducts(sortKey, order, gqlQueryTags);
  const activeOrder = getOrderTag(router?.query?.sort, router?.query?.order);

  const collectionQuery = `*[_type == "collectionPage"]  {
    collectionContent,
    components[]-> 
  }[0]
  `;

  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(collectionQuery);
      setCollectionData(data);
    }
    fetchData();
  }, []);

  const handleRemoveTag = (tag: string) => {
    // Remove tag from query params
    router.query.tags = encodeURIComponent(
      queryTagsArray?.filter((tagItem: string) => tagItem !== tag).join(",")
    );
    router.push(router);
  };

  const removeQueryParam = (param: string) => {
    const { pathname, query } = router;
    const params = new URLSearchParams(query);
    params.delete(param);
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  return (
    <Box maxW="2560px" m="0 auto" id="main-container">
      <NavBar dataN={{ isBlackNavBar: true }} />
      <Box h={`${height}px`} bg="white" w="100%" />

      <Box
        my="6"
        pl={isMobile ? "20px" : "145px"}
        pr={isMobile ? "20px" : "145px"}
      >
        {collectionData?.collectionContent && (
          <PortableText blocks={collectionData?.collectionContent} />
        )}
      </Box>

      <Box w="full">
        <Flex
          pl={isMobile ? "20px" : "145px"}
          justifyContent="space-between"
          pr={isMobile ? "20px" : "145px"}
          py={2}
        >
          <SortSelector />

          <Flex>
            <TagSelector />
            <CollectionsSelector />
          </Flex>
        </Flex>
      </Box>

      <Box w="full" bg="#E7D4C7">
        <Box
          overflowX="auto"
          whiteSpace="nowrap"
          gap={2}
          alignItems="center"
          pl={isMobile ? "20px" : "145px"}
          pr={isMobile ? "20px" : "145px"}
          py={2}
        >
          <Text display="inline" fontWeight={600}>
            Filtros
          </Text>
          {activeOrder && (
            <Tag
              bg="white"
              textColor="black"
              size="md"
              borderRadius="full"
              variant="solid"
            >
              <TagLabel>{activeOrder?.name}</TagLabel>
              <TagCloseButton onClick={() => removeQueryParam("sort")} />
            </Tag>
          )}
          {queryTagsArray?.map((tag) => (
            <Tag
              ml={2}
              bg="white"
              textColor="black"
              size="md"
              key={tag}
              borderRadius="full"
              variant="solid"
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          ))}
        </Box>
      </Box>

      <Box
        my="6"
        pl={isMobile ? "20px" : "145px"}
        pr={isMobile ? "20px" : "145px"}
      >
        <Grid
          gap={5}
          py={5}
          templateColumns={isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"}
        >
          {allProductsData?.data?.products?.nodes?.map((product: IProduct) => (
            <ProductCard
              handle={product.handle}
              imageSrc={product.featuredImage.url}
              title={product.title}
              // @ts-ignore
              price={product?.priceRange?.maxVariantPrice?.amount}
              key={product?.id}
            />
          ))}
        </Grid>
      </Box>

      {collectionData?.components.map((componente: any) => (
        <ComponentRenderer
          key={componente._id}
          component={componente._type}
          data={componente}
        />
      ))}
      <Footer />
    </Box>
  );
};

export default AllCollectionsPage;
