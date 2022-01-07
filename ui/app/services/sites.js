import mainService from "./mainService";

export function siteList() {
  return mainService
    .get("sites/list")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function siteArea(areaId) {
  return mainService
    .get(`sites/${localStorage.getItem("zone_id")}/${areaId}/area`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function siteZone(id) {
  return mainService
    .get(`sites/${id ? id : localStorage.getItem("zone_id")}/zone`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function siteRecords(data) {
  let parameters = "";

  for (let key in data) {
    let value = data[key];
    switch (key) {
      case "order":
        parameters = `${parameters}&order=${value.type}.${value.order}`;
        break;
      case "page":
        parameters = `${parameters}&page=${value}`;

        break;
      case "filter":
        if (value.length >= 1) {
          parameters = `${parameters}&filter=${value}`;
        }
        break;
      case "search":
        if (value.length >= 1) {
          parameters = `${parameters}&search=${value.join(",")}`;
        }
        break;
    }
  }

  return mainService
    .get(`sites/records?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function siteDelete(id) {
  return mainService
    .delete(`sites/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function siteRecord(id) {
  return mainService
    .get("sites/" + id)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function siteUpdate(id, data) {
  return mainService
    .put(`sites/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function siteCreate(data) {
  return mainService
    .post("sites/create", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
