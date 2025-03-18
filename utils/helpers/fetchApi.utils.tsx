import { ConfigApiURL } from "@/constants/Config";
import { useAuth } from "@/context/auth-provider";
import { ToastAndroid } from "react-native";

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
  headers?: Record<string, string>,
  timeout: number = 5000 // Default timeout 5 detik
): Promise<any> {
  const controller = new AbortController();
  const signal = controller.signal;

  const isFormData = body instanceof FormData;
  const BASE_URL = ConfigApiURL.base_url;
  const base_url = BASE_URL + url;

  // Timer untuk membatalkan request jika terlalu lama
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(base_url, {
      method,
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        ...headers,
      },
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      signal, // Tambahkan signal untuk menangani abort
    });
    // console.log(response)

    clearTimeout(timeoutId); // Hapus timeout jika request selesai tepat waktu

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw { status: response.status, data: errorData };
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout, silakan coba lagi");
    }
    throw error;
  }
}

/** CODE OLD */
// export async function fetchApi(
//   url: string,
//   method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//   body?: Record<string, any> | FormData,
//   headers?: Record<string, string>
//   ): Promise<any> {
//   try {
//     const isFormData = body instanceof FormData;
//     const BASE_URL = ConfigApiURL.base_url
//     const base_url = BASE_URL + url
//     // console.log(base_url)

//     const response = await fetch(base_url, {
//       method,
//       headers: {
//         "Content-Type": isFormData ? "multipart/form-data" : "application/json",
//         ...headers,
//       },
//       body: isFormData ? (body as FormData) : JSON.stringify(body),
//     });

//     // Menangani status error (misal: 401, 403)
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null); // Ambil error message dari response
//       throw { status: response.status, data: errorData }; // Melempar error dengan status
//     }

//     return await response.json();
//   } catch (error) {
//     // console.error("Fetch API Error:", error);
//     throw error;
//   }
// }

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
  