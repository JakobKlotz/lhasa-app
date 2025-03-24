import axios from "axios";
import { BACKEND_API_BASE_URL } from "../../constants";

/**
 * Fetches the list of available countries from the backend.
 * @returns A list of country objects with label and code.
 */
export const fetchCountries = async () => {
  const response = await axios.get(`${BACKEND_API_BASE_URL}/countries/`);
  return response.data;
};
