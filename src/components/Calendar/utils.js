// Утилита для приведения юзернеймов к единому формату
export const sanitizeUsername = (username) => {
    if (!username) return ''; // Проверка на undefined или null
    return username.replace(/[\s\n\r\t]+/g, '').trim().toLowerCase();
  };
  
  // Утилита для извлечения текста после слова "Услуга:"
  export const extractServiceInfo = (serviceText) => {
    const match = serviceText.match(/Услуга:\s*(.*)/);
    return match ? match[1].trim() : 'Услуга не указана';
  };
  