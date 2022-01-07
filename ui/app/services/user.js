import mainService from "./mainService";



export function ChangePassword(data) {
    return mainService
        .post("changePassword", data)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export function UpdateUserInfo(data) {
    return mainService
        .put("updateUserInfo", data)
        .then(res => {
            console.log(res)
            return res.data;
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

