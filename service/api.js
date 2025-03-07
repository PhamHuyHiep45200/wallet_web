import request from ".";

export async function connectTokenPublic(data) {
  return request(`/connect/token`, {
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Thêm Content-Type
    },
  });
}

export async function createWalletPublic(data) {
  return request(`/contract-wallet/external-api/create-wallet`, {
    method: "POST",
    data,
  });
}
