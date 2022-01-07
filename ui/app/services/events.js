import mainService from "./mainService";

export function eventSite(id, data) {
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
    .get(`events/${id}/site?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventArea(id, data) {
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
    .get(`events/${id}/area?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventItem(id, data) {
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
    .get(`events/${id}/item?rand=${new Date().getTime()}${parameters}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventDelete(id) {
  return mainService
    .delete(`events/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventRecord(id) {
  return mainService
    .get("events/" + id)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventUpdate(id, data) {
  return mainService
    .put(`events/${id}/update`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventSearch(data) {
  return mainService
    .post(`events/${localStorage.getItem("zone_id")}/search`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventAnalyze(data) {
  return mainService
    .post(`events/analyze`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventViewerAnalyze(data) {
  return mainService
    .post(`events/viewerAnalyze`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventCreate(data) {
  return mainService
    .post(`events/${localStorage.getItem("zone_id")}/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function eventCreateAtArea(data) {
  return mainService
    .post(`events/${localStorage.getItem("zone_id")}/createEventAtArea`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function userEvents() {
  return mainService
    .get("events/user")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
