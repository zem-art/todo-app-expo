export const formatDateTime = (
    dateParams: string | number | Date,
    format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH:MM:SS' | 'DD/MM/YYYY HH:MM:SS'
): string => {
    const date = new Date(dateParams);

    // Validasi input date
    if (isNaN(date.getTime())) {
      throw new Error("Parameter tidak valid. Pastikan input berupa string, number, atau objek Date yang valid.");
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Tentukan format output berdasarkan parameter
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'YYYY-MM-DD HH:MM:SS':
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      case 'DD/MM/YYYY HH:MM:SS':
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      default:
        throw new Error("Format tidak valid. Gunakan format yang didukung.");
    }
}