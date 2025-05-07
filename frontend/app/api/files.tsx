import { BACKEND_API_BASE_URL } from "../../constants";

export interface FileInfo {
  file_name: string;
  datetime: string;
  time: string;
}

export interface AvailableFilesResponse {
  [date: string]: FileInfo;
}

export const fetchAvailableFiles =
  async (): Promise<AvailableFilesResponse> => {
    const response = await fetch(`${BACKEND_API_BASE_URL}/files`);
    if (!response.ok) {
      throw new Error("Network response was not ok fetching available files");
    }
    const data: AvailableFilesResponse = await response.json();
    return data;
  };
