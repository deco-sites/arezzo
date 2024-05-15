import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";

export interface WithTraffic<T> {
  /**
   * @maxItems 2
   */
  content: T[];
  traffic?: number;
}

interface Props {
  text: WithTraffic<string>;
  age: WithTraffic<number>;
  showMenu: WithTraffic<boolean>
}

interface Returns {
  text: WithTraffic<string>;
  age: WithTraffic<number>;
  showMenu: WithTraffic<boolean>
}

export default function loader(
  props: Props,   
  req: Request,
  ctx: AppContext
): Returns {
  
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  return props;
}