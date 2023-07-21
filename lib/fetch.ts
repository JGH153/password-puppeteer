export const fetcherSwr = (url: string) =>
  fetch(url).then((res) => {
    if (res.status === 500) {
      throw new Error(res.statusText);
    }
    return res.json();
  });

export const getAsJson = async <ReturnType>(url: string, headers?: HeadersInit) => {
  const response = await fetch(url, {
    headers: {
      ...headers,
    },
  });
  return (await response.json()) as ReturnType;
};

export const postJsonResponse = async <TRequestType, TResponseType>(
  url: string,
  data: TRequestType,
  headers?: HeadersInit,
): Promise<TResponseType> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.error("Error response", response);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const postOnlyStatus = async <DataType>(
  url: string,
  data: DataType,
  headers?: HeadersInit,
): Promise<boolean> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.ok;
};