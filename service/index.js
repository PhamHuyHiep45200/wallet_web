import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const isRefreshToken = (url) => {
  return url.includes("/user-info/refresh-token");
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const instance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  async function (config) {
    const tokenCode = localStorage.getItem("access_token");
    if (tokenCode && !isRefreshToken(config.url)) {
      const token = localStorage.getItem("access_token");
      config.headers.Authorization = "Bearer " + token;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    const originalRequest = err.config;
    if (
      !window.navigator.onLine &&
      !err.response &&
      err.code === "ERR_NETWORK"
    ) {
      store.dispatch("setOffline", true);
    }
    if (err?.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;

            return axios(originalRequest).then((res) => res.data);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        const bodyData = {
          accesstoken: token,
          refreshToken: refreshToken,
        };
        delete axios.defaults.headers.common["Authorization"];
        axios
          // eslint-disable-next-line no-undef
          .post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user-info/refresh-token`,
            bodyData
          )
          .then(({ data }) => {
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.token;
            originalRequest.headers["Authorization"] = "Bearer " + data.token;
            localStorage.setItem("access_token", data.token);
            processQueue(null, data.token);
            resolve(axios(originalRequest).then((res) => res.data));
          })
          .catch((error) => {
            processQueue(error, null);
            reject(error);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    } else {
      return Promise.reject(err.response);
    }
  }
);

const request = (url, options) => {
  return instance.request({ ...options, url });
};
export default request;
