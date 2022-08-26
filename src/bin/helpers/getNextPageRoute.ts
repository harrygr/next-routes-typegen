import {
  getIsCatchAllRoute as isCatchAllRoute,
  getIsOptionalCatchAllRoute as isOptionalCatchAllRoute,
} from "./utils";

const getNextPageRoute = (fileName: string) => {
  if (isOptionalCatchAllRoute(fileName)) {
    return fileName.split("/[[...")[0];
  }
  if (isCatchAllRoute(fileName)) {
    return fileName.split("/[...")[0];
  }

  const route = fileName
    // remove the file extension
    .replace(/\.[^.]+$/, "")
    // index pages don't need the "/index" when used as hrefs
    .replace("/index", "");

  // if this is the root index file, return "/" instead of ""
  return route === "" ? "/" : route;
};

export default getNextPageRoute;
