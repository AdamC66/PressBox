import axios from "axios";

export const getEnv = () => {
  if (process.env.NODE_ENV === "production") return "production";
  return "local";
};

const getBase = () => {
  const baseMap = {
    production: "http://localhost:8000/",
    local: "http://localhost:8000/",
  };
  return baseMap[getEnv()];
};
export const BASE = getBase();

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const backendFetch = ({
  endpoint,
  method = "GET",
  body = null,
  customInit = {},
  omitToken = false,
}) => {
  const customHeaders = customInit.headers ? customInit.headers : {};
  const token = localStorage.getItem("token");
  if (token && !omitToken) {
    customHeaders.Authorization = `Token ${token}`;
  }
  const init = {
    ...customInit,
    method,
    headers: { ...defaultHeaders, ...customHeaders },
  };
  if (body) {
    init.data = JSON.stringify(body);
  }
  return axios
    .request({
      baseURL: BASE,
      url: endpoint,
      ...init,
    })
    .then((resp) => resp.data);
};
