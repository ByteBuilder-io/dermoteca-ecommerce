import { IImg, SanityBody } from "./default";

export interface IContacUs extends SanityBody {
  titulo: string;
  titulo_descripcion: string;
  description: string;
  isPaddingTop?: boolean;
  isPaddingBottom?: boolean;
  imagen: IImg;
}
