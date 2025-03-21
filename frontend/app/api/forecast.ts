import axios from "axios";
import { BACKEND_API_BASE_URL } from "../constants";

/**
 * Holt die Vorhersagedaten für eine gegebene NUTS-Region.
 * @param nutsId - Ländercode (z. B. 'DE' oder 'AT')
 */
export const fetchForecast = async (nutsId: string) => {
  const response = await axios.get(`${BACKEND_API_BASE_URL}/forecast/${nutsId}`);
  return response.data;
};
