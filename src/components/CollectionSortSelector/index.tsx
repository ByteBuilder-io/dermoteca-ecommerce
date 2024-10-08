import { getCollectionOrderTag } from "@/utils";
import {
  COLLECTION_PRODUCTS_SORT_OPTIONS,
  ALL_PRODUCTS_SORT_OPTIONS,
} from "@/utils/constants";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { GoChevronDown } from "react-icons/go";

const CollectionSortSelector = ({ useCollectionSort = false }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const router = useRouter();
  const activeOrder = getCollectionOrderTag(
    router?.query?.sort,
    router?.query?.order
  );
  const SORT_OPTIONS = useCollectionSort
    ? COLLECTION_PRODUCTS_SORT_OPTIONS
    : ALL_PRODUCTS_SORT_OPTIONS;

  const handleOrderChange = (e: React.ClickEvent<HTMLSelectElement>) => {
    // Add query params and remove them if sort is inactive
    if (e.target.value.length > 1) {
      router.query.sort = e.target.value.split(",")?.[0];
      router.query.order = e.target.value.split(",")?.[1];
      router.push(router);
    } else router.replace("/collections", undefined, { shallow: true });
    onClose();
  };
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Button p="0px" bg="transparent" _hover={{ bg: "transparent" }}>
          Ordenar <GoChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="min-content">
        <PopoverArrow />
        <PopoverBody>
          <VStack w="min-content" align="start">
            {SORT_OPTIONS.map((option) => (
              <Button
                bg={
                  activeOrder?.name === option.name ? "#E7D4C7" : "transparent"
                }
                onClick={handleOrderChange}
                variant="ghost"
                _hover={{
                  bg: "#E7D4C7",
                }}
                value={option.value}
                key={option.name}
              >
                {option.name}
              </Button>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionSortSelector;

{
  /* <Select
placeholder="Ordenar - Todos los productos"
w="auto"
icon={<GoChevronDown />}
border="none"
fontWeight={600}
variant="unstyled"
onChange={handleOrderChange}
>
<option value="created_at,false">Mas reciente</option>
<option value="created_at,true">Mas antiguos</option>
<option value="title,false">Alfabeticamente A - Z</option>
<option value="title,true">Alfabeticamente Z - A</option>
<option value="price,false">Precio Menor - Mayor</option>
<option value="price,true">Precio Mayor - Menor</option>
</Select> */
}
