import axios from "axios";

export const baseURL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8000/api/"
    : "/api/";

const mainService = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: "Token " + localStorage.getItem("token"),
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

mainService.interceptors.request.use((config) => {
  let loadinBar = document.getElementById("loadinBar");
  let bar = loadinBar.querySelector("span");

  bar.classList.remove("w-3/4");
  bar.classList.add("w-full");

  setTimeout(() => {
    document.body.classList.remove("load");
  }, 500);

  return config;
});

mainService.interceptors.request.use((response) => {
  document.body.classList.add("load");

  let loadinBar = document.getElementById("loadinBar");
  let bar = loadinBar.querySelector("span");

  setTimeout(() => {
    bar.classList.add("w-1/4");
  }, 100);
  setTimeout(() => {
    bar.classList.remove("w-1/4");
    bar.classList.add("w-2/4");
  }, 800);
  setTimeout(() => {
    bar.classList.remove("w-2/4");
    bar.classList.add("w-3/4");
  }, 1500);

  return response;
});

function handleUploadProgress(ev) {
  console.log(ev);
  // do your thing here
}

function onUploadProgress(ev) {
  console.log(ev);
  // do your thing here
}

export default mainService;
