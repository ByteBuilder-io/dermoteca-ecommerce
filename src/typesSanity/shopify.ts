import { IImg } from "./docs/default";

export interface ICartLineInput {
  quantity: number;
  merchandiseId: string;
}

export interface ISanityBlogPost {
  title: string;
  slug: ISlug;
  featuredImage: IImg;
  componentes: any[];
  _id: string;
  _createdAt: string;
}

export interface IUpdateCartLineInput {
  quantity: number;
  id: string;
}

export interface IPrice {
  amount: string;
}

export interface IImage {
  url: string;
}

export interface IProduct {
  id: string;
  featuredImage: IImage;
  handle: string;
  title: string;
  priceRange: IPriceRange;
}

export interface ISanityProduct {
  store: IStore;
}

export interface ISlug {
  current: string;
}

export interface IPriceRange {
  maxVariantPrice: number | { amount: string };
  minVariantPrice: number | { amount: string };
}

export interface IStore {
  slug: ISlug;
  previewImageUrl: string;
  title: string;
  priceRange: IPriceRange;
  gid: string;
}

export interface IMerchandise {
  id: string;
  price: IPrice;
  product: IProduct;
  selectedOptions: ISelectedOptions[];
}

export interface ISelectedOptions {
  name: string;
  value: string;
}

export enum ProductSortKey {
  BEST_SELLING = "BEST SELLING",
  CREATED_AT = "CREATED_AT",
  ID = "ID",
  PRICE = "PRICE",
  PRODUCT_TYPE = "PRODUCT_TYPE",
  RELEVANCE = "RELEVANCE",
  TITLE = "TITLE",
  UPDATED_AT = "UPDATED_AT",
  VENDOR = "VENDOR",
}
