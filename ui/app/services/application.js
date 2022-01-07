import mainService from "./mainService";

export function application() {
  return mainService.get("/userSetting").then((json) => {
    return json.data;
  });
}
