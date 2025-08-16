import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const getStats = async () => {
  const res = await axios.get(`${BASE_URL}/events/stats`);
  return res.data;
};
