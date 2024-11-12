import { gapi } from 'gapi-script';
import dayjs from 'dayjs';

const API_KEY = 'AIzaSyBcd5_84w91WHOK_OCiwnOL8L5WhMXyAa0';
const CLIENT_ID = '443926305689-3holk18bjkd54b21gi58i54r3e5a10th.apps.googleusercontent.com';
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/spreadsheets.readonly";

// Инициализация GAPI клиента
export const initializeGAPI = () => {
  return gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      "https://sheets.googleapis.com/$discovery/rest?version=v4"
    ],
    scope: SCOPES,
  });
};

// Получение списка календарей
export const fetchCalendars = () => {
  return gapi.client.calendar.calendarList.list()
    .then(response => response.result.items)
    .catch(error => {
      console.error("Ошибка при загрузке календарей:", error);
      throw error;
    });
};

// Получение событий с цветом "павлин" для выбранных календарей
export const fetchEvents = (selectedCalendars, startOfMonth, endOfMonth) => {
  const allEvents = [];
  const peacockColorId = "7"; // Код цвета "павлин"
  const basilColorId = "10";  // Код цвета "базилик" (уточните его)

  const fetchEventsForCalendar = (calendarId) => {
    console.log(`Запрос событий для календаря: ${calendarId}, Период: ${startOfMonth} - ${endOfMonth}`);
    
    return gapi.client.calendar.events.list({
      calendarId,
      timeMin: startOfMonth,
      timeMax: endOfMonth,
      showDeleted: false,
      singleEvents: true,
      maxResults: 250,
      orderBy: 'startTime',
    })
    .then(response => {
      // Фильтруем события, оставляя только события цветов "павлин" и "базилик"
      const filteredEvents = response.result.items.filter(event => 
        event.colorId === peacockColorId || event.colorId === basilColorId
      );
      console.log(`Получены события цветов "павлин" и "базилик" для календаря ${calendarId}:`, filteredEvents);
      return filteredEvents;
    })
    .catch(error => {
      console.error(`Ошибка при загрузке событий для календаря ${calendarId}:`, error);
      throw error;
    });
  };

  // Запрос событий для всех выбранных календарей
  const promises = selectedCalendars.map(calendar => fetchEventsForCalendar(calendar.id));

  return Promise.all(promises)
    .then(eventArrays => {
      eventArrays.forEach(eventArray => allEvents.push(...eventArray));
      return allEvents;
    })
    .catch(error => {
      console.error('Ошибка при загрузке всех событий:', error);
      throw error;
    });
};


// Получение данных из Google Sheets
export const fetchSheetData = (spreadsheetId, ranges) => {
  const promises = ranges.map(({ sheet, range }) => {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }).then(response => {
      return { sheet, values: response.result.values };
    }).catch(error => {
      console.error(`Ошибка при получении данных из листа ${sheet}:`, error);
      throw error;
    });
  });

  return Promise.all(promises);
};

// Функция для получения данных из нескольких листов по ID
export const fetchMultipleSheetsData = async () => {
  const spreadsheetId = '1ACXyzSPRJpUynAlVman0FfDt2hieyi-7U86aLqxsR10';  // ID Google Sheets

  // Добавляем листы по их ID:
  const ranges = [
    { sheet: '349313634', range: 'A:I' },   // Лист "ПАРТНЕРЫ" по ID (указываем диапазон)
    { sheet: '1824687355', range: 'C:G' },  // Лист "ПОИСК" по ID (указываем диапазон)
    { sheet: '1234567890', range: 'A:D' }   // Пример нового листа по ID (замени на реальный ID)
  ];

  try {
    const sheetData = await fetchSheetData(spreadsheetId, ranges);
    console.log('Данные с нескольких листов:', sheetData);
    return sheetData;
  } catch (error) {
    console.error('Ошибка при получении данных из нескольких листов:', error);
    throw error;
  }
};
