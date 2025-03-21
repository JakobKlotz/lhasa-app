import axios from "axios";
import { BACKEND_API_BASE_URL } from "../constants";

/**
 * Fetches the forecast data for a given NUTS region.
 * @param nutsId - Country or region code (e.g., 'DE', 'AT').
 * @returns Forecast data suitable for Plotly rendering.
 */
export const fetchForecast = async (nutsId: string) => {
  const response = await axios.get(`${BACKEND_API_BASE_URL}/forecast/${nutsId}`);
  return response.data;
};
