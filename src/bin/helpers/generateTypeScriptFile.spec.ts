import { describe, expect, it } from "vitest";
import generateTypeScriptFile from "./generateTypeScriptFile";

describe("generateTypeScriptFile", () => {
  it("generates types for pages directory with a single page", () => {
    const types = generateTypeScriptFile(`${__dirname}/mocks/pages-no-api`);

    expect(types).toMatchInlineSnapshot(`
      "// Do not modify this file. It is auto-generated.
      //
      // To regenerate it run the \`generate-route-types\` command.

      declare module 'next-routes-typegen' {
        type Query = Record<string, any>;
        
        export type TypeSafePage = 
          |  \\"/\\"
          |  { route: \\"/\\", query?: Query, path?: undefined }

        export type TypeSafeApiRoute = TypeSafePage

        export const getRoute: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
        export const getPathname: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
      }

      "
    `);
  });

  it("generates types for pages directory with pages and api routes", () => {
    const types = generateTypeScriptFile(`${__dirname}/mocks/pages`);

    expect(types).toMatchSnapshot();
  });

  it("generates types for an empty pages directory", () => {
    const types = generateTypeScriptFile(`${__dirname}/mocks/empty-pages`);

    expect(types).toMatchInlineSnapshot(`
      "// Do not modify this file. It is auto-generated.
      //
      // To regenerate it run the \`generate-route-types\` command.

      declare module 'next-routes-typegen' {
        type Query = Record<string, any>;
        
        export type TypeSafePage = never

        export type TypeSafeApiRoute = TypeSafePage

        export const getRoute: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
        export const getPathname: (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
      }

      "
    `);
  });
});
