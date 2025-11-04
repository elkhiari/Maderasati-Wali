export const prepareHeaders = (headers: Headers, { getState }: any) => {
  const token = getState().user.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};
