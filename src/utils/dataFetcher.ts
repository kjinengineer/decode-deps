import { portNumber } from "../constant";

let cachedData: any = null;

export async function fetchData() {
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(`http://localhost:${portNumber}/track`);
  const data = await response.json();
  cachedData = data;

  return cachedData;
}
