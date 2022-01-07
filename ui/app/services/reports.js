import mainService from "./mainService";

export function getEventByRange(data) {
  return mainService
    .post("reports/eventByRange", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getEventByMonth(data) {
  return mainService
    .post("reports/eventByMonth", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getEventBySite(data) {
  return mainService
    .post("reports/eventBySite", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
