import { Box, Grid, GridItem, useMediaQuery } from "@chakra-ui/react";

import { IBasicImage } from "@/typesSanity/docs/basicImage60";
import ComponentText from "./ComponentText";
import ComponentImg from "./ComponentImg";

import { useStore } from "@/store";

interface ContainerProps {
  data: IBasicImage;
}

const BasicImageText60 = (props: ContainerProps) => {
  const { data } = props;
  const { value } = useStore();
  const [isMobile] = useMediaQuery(`(max-width: ${value})`);
  const isLeft = data.orientacion === "left";

  const showImg = () => {
    if (!isMobile && !data.mostrar_imagen) {
      return <ComponentImg data={data} isMobile={isMobile} isLeft={isLeft} />;
    } else if (isMobile && data.mostrar_imagen) {
      return <ComponentImg data={data} isMobile={isMobile} isLeft={isLeft} />;
    } else if (isMobile && !data.mostrar_imagen) {
      return <></>;
    } else {
      return <ComponentImg data={data} isMobile={isMobile} isLeft={isLeft} />;
    }
  };

  return (
    <Box
      position="relative"
      width="100%"
      mt={data.isPaddingTop ? "37px" : ""}
      mb={data.isPaddingBottom ? "37px" : ""}
    >
      <Grid templateColumns={isMobile ? "1fr" : isLeft ? "60% 40%" : "40% 60%"}>
        <GridItem>
          {isLeft ? (
            <ComponentText data={data} isMobile={isMobile} />
          ) : (
            showImg()
          )}
        </GridItem>
        <GridItem>
          {isLeft ? (
            showImg()
          ) : (
            <ComponentText data={data} isMobile={isMobile} />
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BasicImageText60;
