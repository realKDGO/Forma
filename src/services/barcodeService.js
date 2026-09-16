import { apiClient } from "./apiClient";

export const barcodeService = {
  async lookup(barcode) {
    const response = await apiClient.get(`/barcodes/${encodeURIComponent(barcode)}`);
    return response.data;
  },
};
