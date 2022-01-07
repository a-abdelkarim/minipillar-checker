import mainService from "./mainService";

export function getFeatures() {
  return mainService
    .get("features")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
