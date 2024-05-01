import { allowCorsFor } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";
import { getFlagsFromRequest } from "apps/utils/cookie.ts";

export interface Props {
    test?: string;
}

const loader = (
    { test }: Props,
    req: Request, 
    ctx: AppContext
) => {
    Object.entries(allowCorsFor(req)).map(([name, value]) => {
        ctx.response.headers.set(name, value);
    });

    const _flags = getFlagsFromRequest(req);
    const flags: Record<string, string | boolean> = {};
    _flags.forEach((flag) => flags[flag.name] = flag.value);

    return {
        test: test,
        flags,
    }
}

export default loader;