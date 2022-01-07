import mainService from "./mainService";

export function itemTypeList() {
  return mainService
    .get("itemTypes/list")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function itemTypeSubList(id) {
  return mainService
    .get(`itemTypes/${id}/sub`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function itemTypeRecords(data) {
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
    .get(`itemTypes/records?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function itemTypeDelete(id) {
  return mainService
    .delete(`itemTypes/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function itemTypeRecord(id) {
  return mainService
    .get("itemTypes/" + id)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function itemTypeUpdate(id, data) {
  return mainService
    .put(`itemTypes/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function itemTypeCreate(data) {
  return mainService
    .post("itemTypes/create", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function itemTypeListWithParent(id, data) {
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
    .get(`itemTypes/${id}/sub`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
