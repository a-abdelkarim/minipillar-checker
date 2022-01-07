import mainService from "./mainService";

export function eventSourceTypeList() {
  return mainService
    .get(`eventSourceTypes/${localStorage.getItem("zone_id")}/list`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function eventSourceTypeRecords(data) {
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
    .get(`eventSourceTypes/records?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function eventSourceTypeDelete(id) {
  return mainService
    .delete(`eventSourceTypes/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function eventSourceTypeRecord(id) {
  return mainService
    .get("eventSourceTypes/" + id)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventSourceTypeUpdate(id, data) {
  return mainService
    .put(`eventSourceTypes/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventSourceTypeCreate(data) {
  return mainService
    .post("eventSourceTypes/create", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
