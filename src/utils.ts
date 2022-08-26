// NOTE, these will be replaced with the "real" TypeSafePage type
// when generating types for a project
type Query = Record<string, any>;
type BaseTypeSafePage =
  | string
  | { route: string; path?: string; query?: Query }
  | {
      route: string;
      path?: string;
      params: Record<string, string | number>;
      query?: Query;
    };
type BaseTypeSafeApiRoute = BaseTypeSafePage;

export const getPathname = <T extends BaseTypeSafePage | BaseTypeSafeApiRoute>(
  typeSafeUrl: T
) => {
  if (typeof typeSafeUrl === "string") {
    return typeSafeUrl;
  } else {
    return typeSafeUrl.route;
  }
};

const getSearchParams = (query: Query | undefined) => {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams(query).toString();
  return `?${params}`;
};

export const getRoute = <T extends BaseTypeSafePage | BaseTypeSafeApiRoute>(
  typeSafeUrl: T
) => {
  if (typeof typeSafeUrl === "string") {
    return `${typeSafeUrl}`;
  }

  const searchParams = getSearchParams(typeSafeUrl.query);

  const params = "params" in typeSafeUrl ? typeSafeUrl.params : {};
  const route = Object.keys(params).reduce(
    (r, param) => r.replace(`[${param}]`, `${params[param]}`),
    typeSafeUrl.route
  );

  const path = typeSafeUrl.path || "";

  return `${route}${path}${searchParams}`;
};
