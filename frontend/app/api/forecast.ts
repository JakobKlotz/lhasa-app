import axios from "axios";
import { BACKEND_API_BASE_URL } from "../../constants";

/**
 * Fetches the forecast data for a given NUTS region.
 * @param nutsId - Country or region code (e.g., 'DE', 'AT').
 * @param tif - Tif to use for the forecast.
 * @returns Forecast data suitable for Plotly rendering.
 */
export const fetchForecast = async (nutsId: string, tif: string) => {
  const response = await axios.get(
    `${BACKEND_API_BASE_URL}/forecast/?nuts_id=${nutsId}&tif=${tif}`,
  );
  return response.data;
};
