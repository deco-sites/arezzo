import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";
import { getFlagsFromRequest } from "apps/utils/cookie.ts";

export interface TrackElement {
  cssSelector: string;
  eventType: "click" | "hover";
  eventName: string;
}

export interface Props {
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
  trackedElements?: TrackElement[];
}

/**
 * @title Layout Effects
 */
const loader = (
  { injectedScript, injectedStyle, trackedElements }: Props,
  req: Request,
  ctx: AppContext,
) => {
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  const _flags = getFlagsFromRequest(req);
  const flags: Record<string, string | boolean> = {};
  _flags.forEach((flag) => flags[flag.name] = flag.value);

  return {
    injectedScript,
    injectedStyle,
    trackedElements,
    flags,
  };
};

export default loader;
