import axios from "axios";
import { BACKEND_API_BASE_URL } from "../constants";

/**
 * Holt die Liste aller Länder vom Backend.
 */
export const fetchCountries = async () => {
  const response = await axios.get(`${BACKEND_API_BASE_URL}/countries/`);
  return response.data;
};
