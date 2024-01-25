import { getRequest, postRequest } from "../api/apiCaller";



export const Register = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://localhost:82/api/register",
    params,
    successCallback,
    errorCallback
  );
};

export const Update = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://localhost:82/api/update",
    params,
    successCallback,
    errorCallback
  );
};
export const getRoomChats = async (params, successCallback, errorCallback) => {
  await getRequest(
    "http://localhost:82/api/roomChats",
    params,
    successCallback,
    errorCallback
  );
};
export const updateUSer = async (params, successCallback, errorCallback) => {
  await getRequest(
    `http://localhost:82/api/update/${params.id}`,
    params,
    successCallback,
    errorCallback
  );
};

export const sentMessageDB = async (params, successCallback, errorCallback) => {
  await postRequest(
    "http://localhost:82/api/chat",
    params,
    successCallback,
    errorCallback
  );
};

export const getMessageDB = async (params, successCallback, errorCallback) => {
  await getRequest(
    `http://localhost:82/api/chat/${params.id}`,
    params,
    successCallback,
    errorCallback
  );
};
