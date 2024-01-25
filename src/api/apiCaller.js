import axios from "axios";



axios.interceptors.request.use((config) => {
//   const token = getToken();
//   // const tokenType = getTokenType();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

  config.headers["Access-Control-Allow-Origin"] = "*";
//   config.headers["Access-Control-Allow-Methods"] = "*";
//   config.headers["Access-Control-Allow-Headers"] = "*";
//   config.headers["Access-Control-Max-Age"] = 1728000;
  config.headers["Content-Type"] = "application/json";
  return config;
});


export const getRequest = (
  url = "",
  params,
  successCallback,
  errorCallback
) => {
  return axios
    .get(url, { params })
    .then((response) => {
      if (successCallback) {
        try {
          successCallback(response);
        } catch (error) {
          // console.log(error);
        }
      }
    })
    .catch((error) => {
      if (errorCallback)
        try {
          errorCallback(error);
        } finally {
          console.log(error);
        }
    });
};

export const postRequest = async (
  url = "",
  params,
  successCallback,
  errorCallback
) => {
  return await axios
    .post(url, params)
    .then((response) => {
      if (successCallback) {
        try {
          successCallback(response);
        } catch (error) {
          // console.log("error", error);
        }
      }
    })
    .catch((error) => {
      if (errorCallback)
        try {
          errorCallback(error);
        } finally {
          // console.log(error);
        }
    });
};

export const putRequest = (
  url = "",
  params = {},
  successCallback,
  errorCallback,
  headers = {}
) => {
  return axios
    .put(url, params, {
      headers,
    })
    .then((response) => {
      if (successCallback) {
        try {
          successCallback(response);
        } catch (error) {
          // console.log(error);
        }
      }
    })
    .catch((error) => {
      if (errorCallback)
        try {
          errorCallback(error);
        } finally {
          // console.log(error);
        }
    });
};
export const deleteRequest = (
  url = "",
  params = {},
  successCallback,
  errorCallback
) => {
  return axios
    .delete(url, {
      data: params,
    })
    .then((response) => {
      if (successCallback) {
        try {
          successCallback(response);
        } catch (error) {
          // console.log(error);
        }
      }
    })
    .catch((error) => {
      if (errorCallback)
        try {
          errorCallback(error);
        } finally {
          // console.log(error);
        }
    });
};