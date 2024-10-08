import TipsCards from "@/components/TipsCards";
import { ITipsMenu } from "@/typesSanity/docs/tipsCards";

interface ITipsCardsS {
  data: ITipsMenu;
}

const TipsCardsSanity = ({ data }: ITipsCardsS) => {
  return <TipsCards data={data} />;
};

export default TipsCardsSanity;
