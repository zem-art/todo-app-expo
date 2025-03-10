import { ConfigApiURL } from "@/constants/Config";

/**
 * 
 * @param url Endpoint API yang akan dipanggil.
 * @param method Metode HTTP seperti GET, POST, dll. Default adalah GET.
 * @param body Data yang akan dikirim dalam format JSON atau FormData.
 * @param headers Header tambahan jika diperlukan.
 * @returns 
 * 
 * NOTE : Fungsi otomatis mendeteksi apakah body menggunakan JSON atau FormData berdasarkan tipe data.
 */
export async function fetchApi(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: Record<string, any> | FormData,
    headers?: Record<string, string>
  ): Promise<any> {
    try {
      const isFormData = body instanceof FormData;
      const BASE_URL = ConfigApiURL.base_url
      const base_url = BASE_URL + url
      // console.log(base_url)

      const response = await fetch(base_url, {
        method,
        headers: {
          "Content-Type": isFormData ? "multipart/form-data" : "application/json",
          ...headers,
        },
        body: isFormData ? (body as FormData) : JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // console.error("Fetch API Error:", error);
      throw error;
    }
}

/** HOW TO USE :
 * 
 * IN JSON
 * 
 * import { fetchApi } from "./fetchApi";
    async function getData() {
    const data = await fetchApi("https://api.example.com/data", "POST", {
        key: "value",
    });
    console.log(data);
    }

 * 
 *
 * IN FORM DATA
 * 
 * async function uploadFile() {
   const formData = new FormData();
   formData.append("file", {
        uri: "file:///path/to/file.jpg",
        name: "file.jpg",
        type: "image/jpeg",
    } as any); // Use `as any` to avoid TypeScript errors in Expo
    formData.append("description", "Test file upload");

    const response = await fetchApi("https://api.example.com/upload", "POST", formData);
    console.log(response);
    }
 *
 *
 * 
 */
  