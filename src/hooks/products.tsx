import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity.client";

export const useSanityProduct = (handle: string) => {
  const query = `*[_type == "product" && store.slug.current == "${handle}"][0]{
    ...,
    store {
      ...,
      variants[]->
    }
  }
  `;
  const sanityProductData = useQuery(
    ["sanityProduct", handle],
    () => client.fetch(query),
    { enabled: !!handle }
  );

  return sanityProductData;
};

export const useShopifyProduct = (handle: string) => {
  const shopifyProductData = useQuery(
    ["shopifyProduct", handle],
    () => fetch(`/api/products/${handle}`).then((res) => res.json()),
    { enabled: !!handle }
  );

  return shopifyProductData;
};

export const useProductRecommendations = (productId: string) => {
  const [productRecommendations, setProductRecommendations] = useState([]);

  useEffect(() => {
    getProductRecommendations(productId);
  }, [productId]);

  async function getProductRecommendations(productId: string) {
    const res = await fetch(
      `/api/product-recommendations?productId=${productId}`
    );

    const data = await res.json();
    setProductRecommendations(data?.data.productRecommendations);
  }

  return { productRecommendations };
};

export const useAllTags = () => {
  const allTagsData = useQuery(["tags"], () =>
    fetch("/api/products/tags").then((res) => res.json())
  )?.data;

  return allTagsData;
};

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchProductPage = (handle: string) => {
    const query = `*[_type == "product" && store.slug.current == "${handle}"][0]{
      ...,
      store {
        ...,
        variants[]->
      }
    }
    `;

    queryClient.prefetchQuery(["sanityProduct", handle], () =>
      client.fetch(query)
    );
    queryClient.prefetchQuery(["shopifyProduct", handle], () =>
      fetch(`/api/products/${handle}`).then((res) => res.json())
    );
  };

  return { prefetchProductPage };
};
