export const SingleProductQuery = `#graphql
  query SingleProductQuery($handle: String!) {
    product(handle: $handle) {
      title
      handle
      collections(first: 10) {
        nodes {
          handle
          title
        }
      }
      variants (first: 10) {
        nodes {
          id
          title
        }
      }
    }
  }
`;
