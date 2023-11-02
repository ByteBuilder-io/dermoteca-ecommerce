import { ISanityBlogsPage, ISanityBlogPost } from "@/typesSanity/shopify";
import {
  getAllSanityBlogPosts,
  getSanityBlogPage,
  getSanityBlogPost,
} from "@/utils/sanityFunctions";
import { useQuery } from "@tanstack/react-query";

export const useSanityBlogPage = (initialData: ISanityBlogsPage) => {
  const sanityBlogPageData = useQuery(
    ["sanityBlogPage"],
    () => getSanityBlogPage(),
    { initialData }
  );

  return sanityBlogPageData;
};

export const useSanityBlogPost = (slug: string) => {
  const sanityBlogData = useQuery(["sanityBlog", slug], () =>
    getSanityBlogPost(slug)
  );

  return sanityBlogData;
};

export const useAllSanityBlogPosts = (initialData: ISanityBlogPost[]) => {
  const allSanityBlogsData = useQuery(
    ["allSanityBlogs"],
    () => getAllSanityBlogPosts(),
    { initialData }
  );

  return allSanityBlogsData;
};
