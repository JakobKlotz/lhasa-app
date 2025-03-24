import axios from "axios";
import { BACKEND_API_BASE_URL } from "../../constants";

/**
 * Triggers a backend request to download the latest data.
 * No data is returned, but the call ensures the latest version is ready.
 */
export const downloadData = async () => {
  await axios.post(`${BACKEND_API_BASE_URL}/download/`);
};
