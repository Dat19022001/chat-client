import { getRequest, postRequest } from "../api/apiCaller";


 
export const sentMessage = async (params, successCallback, errorCallback) => {
  await postRequest("http://localhost:5005/webhooks/rest/webhook", params, successCallback, errorCallback);
};

export const Register = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://192.168.8.47:82/api/register",
    params,
    successCallback,
    errorCallback
  );
};

export const Update = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://192.168.8.47:82/api/update",
    params,
    successCallback,
    errorCallback
  );
};
export const getRoomChats = async (params, successCallback, errorCallback) => {
  await getRequest(
    "http://192.168.8.47:82/api/roomChats",
    params,
    successCallback,
    errorCallback
  );
};
export const updateUSer = async (params, successCallback, errorCallback) => {
  await getRequest(
    `http://192.168.8.47:82/api/update/${params.id}`,
    params,
    successCallback,
    errorCallback
  );
};

export const sentMessageDB = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://192.168.8.471:82/api/chat",
    params,
    successCallback,
    errorCallback
  );
};

export const getMessageDB = async (params, successCallback, errorCallback) => {
  await getRequest(
    `http://192.168.8.47:82/api/chat/${params.id}`,
    params,
    successCallback,
    errorCallback
  );
};
