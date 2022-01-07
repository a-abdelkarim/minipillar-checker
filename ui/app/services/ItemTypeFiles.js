import mainService from "./mainService";

export function itemTypeFileDelete(id) {
  return mainService
    .delete(`itemTypeFiles/${id}/delete`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function itemTypeFileCreate(id, data) {
  return mainService
    .post(`itemTypeFiles/${id}/create`, data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
