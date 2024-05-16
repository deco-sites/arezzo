import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";
import { getFlagsFromRequest } from "apps/utils/cookie.ts";

export interface TrackElement {
  cssSelector: string;
  eventType: "click" | "hover";
  eventName: string;
}

export interface Code {
  /**
   * @title JavaScript to run
   * @format code
   * @language javascript
   */
  injectedScript?: string;
  /**
   * @title CSS to run
   * @format code
   * @language css
   */
  injectedStyle?: string;
}

export interface Props {
  /**
   * @maxItems 2
   */
  variants: Code[];
  trackedElements?: TrackElement[];
}

/**
 * @title Layout Effects
 */
const loader = (
  { variants, trackedElements }: Props,
  req: Request,
  ctx: AppContext,
) => {
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  return {
    variants,
    trackedElements,
  };
};

export default loader;
