#!/usr/bin/env node

import path from "path";
import fs from "fs";
import generateTypeScriptFile from "./helpers/generateTypeScriptFile";
import yargs from "yargs";

const writeTypesToDisc = (
  nextPagesDirectory: string,
  typeFolderPath: string,
  outputFilename: string
) => {
  const typeScriptFile = generateTypeScriptFile(nextPagesDirectory);
  outputFilename =
    outputFilename.endsWith(".ts") || outputFilename.endsWith(".tsx")
      ? outputFilename
      : `${outputFilename}.ts`;

  fs.mkdirSync(typeFolderPath, { recursive: true });
  const saveLocation = path.join(typeFolderPath, outputFilename);
  fs.writeFileSync(saveLocation, typeScriptFile);

  console.log(`📚 types written to ${saveLocation}`);
};

if (require.main === module) {
  const argsP = yargs(process.argv.slice(2))
    .scriptName("generate-route-types")
    .option("p", {
      alias: "pages-dir",
      demandOption: false,
      default: "./pages",
      type: "string",
      describe: "the location of the Next.js pages directory",
    })
    .option("o", {
      alias: "output",
      demandOption: false,
      default: "src/generated",
      type: "string",
      describe: "the location to save the generated routes module",
    })
    .option("f", {
      alias: "output-filename",
      demandOption: false,
      default: "routes.d.ts",
      type: "string",
      describe: "the name of the file to save",
    })
    .help().argv;

  Promise.resolve(argsP)
    .then((args) => {
      if (!fs.existsSync(args.p)) {
        throw new Error(
          `pages directory "${args.p}" does not exist. Run with the -p flag to specify the pages directory. E.g. -p ./src/pages`
        );
      }
      writeTypesToDisc(args.p, args.o, args.f);
    })
    .catch((error) => {
      console.error("✖", error.message);
      process.exit(1);
    });
}
