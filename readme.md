# next-routes-typegen

[![npm](https://img.shields.io/npm/v/next-routes-typegen)](https://www.npmjs.com/package/next-routes-typegen)

A type generator for Next.js routes for fully typesafe routes.

This is heavily derived from [next-type-safe-routes][next-type-safe-routes]. The main difference being that rather than being a Next.js plugin that runs continuously with your Next.js server this package is designed to be run separately as a script, reducing overhead and the need to an extra script running in production.

## Installation

yarn

```
yarn add next-routes-typegen
```

npm

```
npm install next-routes-typegen
```

## How it works

This package comes with a `generate-route-types` command. This script traverses your Next.js app's pages directory and generates types for each page and api route.

It will output a module declaration file in the location of your choosing that will override the default types of the package with your route types. You should commit this file to source control and regenerate it when your routes change.

You can then import the provided route util functions that will be fully typed.

## Usage

Run the `generate-route-types` to generate your routes file.

```
[generate-route-types]
Options:
      --version          Show version number                           [boolean]
  -p, --pages-dir        the location of the Next.js pages directory
                                                   [string] [default: "./pages"]
  -o, --output           the location to save the generated routes module
                                             [string] [default: "src/generated"]
  -f, --output-filename  the name of the file to save
                                               [string] [default: "routes.d.ts"]
      --help             Show help                                     [boolean]
```

E.g.

```bash
generate-route-types --pages-dir ./src/pages --output ./src/vendor
```

Then, use the provided route utils in your app. They will be fully typed for your app's routes. E.g.

```tsx
import { getRoute } from "next-routes-typegen";

// routes without parameters can just be strings
const route = getRoute("/posts");
// or, for dynamic routes
const route = getRoute({ route: "/users/[id]", params: { id: 99 } });
```

You can also use the types directly for use in your own abstractions:

```tsx
import type { TypeSafePage } from "next-routes-typegen";
```

## Development workflow

The most basic way to use this package is to manually run the `generate-route-types` command when you change your pages or api routes.

You can also add it to the `prebuild` and/or `predev` scripts to your package.json to automatically regenerate the route types when you start your dev server or build your app.

```
{
  "scripts": {
    "generate-routes": "generate-route-types -p ./src/pages -o ./src/generated",
    "prestart": "yarn generate-routes",
    "predev": "yarn generate-routes"
  }
}
```

[next-type-safe-routes]: https://github.com/ckastbjerg/next-type-safe-routes
