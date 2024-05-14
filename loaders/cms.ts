import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";

export interface Config {
  text: string;
  age: number;
  showMenu: boolean;
}

interface Props {

  configs?: Config[];
}

interface Returns {
  configs?: Config[];
}


export default function loader(
  { configs }: Props,   
  req: Request,
  ctx: AppContext
): Returns {
  
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  return { 
    configs,
  }
}