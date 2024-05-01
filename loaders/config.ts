import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";
import { getFlagsFromRequest } from "apps/utils/cookie.ts";

/**
 * @title JavaScript to run
 * @format textarea
 */
type JSToRun = string;

export interface JS {
  props: {
    jsToRun: JSToRun;
  };
}

export type Configuration = JS;

export interface Props {
  configurations?: Configuration[];
}

const loader = (
  { configurations }: Props,
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
    configurations,
    flags,
  };
};

export default loader;
