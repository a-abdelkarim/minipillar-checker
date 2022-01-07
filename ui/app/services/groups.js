import mainService from "./mainService";

export function zoneList() {
  return mainService
    .get("zones/list")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function zoneSearch(data) {
  return mainService
    .get(
      `zones/${localStorage.getItem(
        "zone_id"
      )}/search?rand=${new Date().getTime()}&search=${data.search}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function groupRecords(data) {
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
    .get(`groups/records?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function zoneDelete(id) {
  return mainService
    .delete(`zones/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function zoneRecord(id) {
  return mainService
    .get("zones/" + id)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function zoneUpdate(id, data) {
  return mainService
    .put(`zones/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function groupCreate(data) {
  return mainService
    .post("groups/create", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function groupUpdate(id, data) {
  return mainService
    .put(`groups/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function groupDelete(id) {
  return mainService
    .delete(`groups/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function groupRecord(id) {
  return mainService
    .get(`groups/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function listGroups() {
  return mainService
    .get("groups/list")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
