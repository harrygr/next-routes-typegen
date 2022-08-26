import { ApiRoute, Page } from "./types";

const getParam = (param: string) => `"${param}": string | number`;

const getTypeSafeRoute = ({
  route,
  params,
  isCatchAllRoute,
  isOptionalCatchAllRoute,
}: ApiRoute) => {
  if (!params || params.length === 0) {
    if (isOptionalCatchAllRoute) {
      return [
        `"${route}"`,
        `{ route: "${route}", path?: string, query?: Query }`,
      ];
    }
    if (isCatchAllRoute) {
      return [`{ route: "${route}", path: string, query?: Query }`];
    }
    return [
      `"${route}"`,
      `{ route: "${route}", query?: Query, path?: undefined }`,
    ];
  }

  const paramsString = params.map(getParam).join(", ");
  if (isOptionalCatchAllRoute) {
    return [
      `"${route}"`,
      `{ route: "${route}", path?: string, params: { ${paramsString} }, query?: Query }`,
    ];
  }

  if (isCatchAllRoute) {
    return [
      `{ route: "${route}", path: string, params: { ${paramsString} }, query?: Query }`,
    ];
  }

  return [
    `{ route: "${route}", params: { ${paramsString} }, query?: Query, path?: undefined }`,
  ];
};

type Args = {
  apiRoutes: ApiRoute[];
  pages: Page[];
};

const getFileContent = ({ apiRoutes, pages }: Args) => {
  const packageName = require(__dirname + "/../../../package.json").name;

  const pageRouteType =
    pages
      .flatMap(getTypeSafeRoute)
      .map((type) => `\n    |  ${type}`)
      .join("") || "never";

  const apiRouteType =
    apiRoutes.length > 0
      ? apiRoutes
          .flatMap(getTypeSafeRoute)
          .map((type) => `\n    |  ${type}`)
          .join("")
      : "TypeSafePage";

  return `// Do not modify this file. It is auto-generated.
//
// To regenerate it run the \`generate-route-types\` command.

declare module '${packageName}' {
  type Query = Record<string, any>;
  
  export type TypeSafePage = ${pageRouteType}

  export type TypeSafeApiRoute = ${apiRouteType}

  export const getRoute: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
  export const getPathname: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
}

`;
};

export default getFileContent;
