import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import { fetchSheetData } from './api'; // Предполагаем, что эта функция настроена для работы с Google Sheets API

const spreadsheetId = '1ACXyzSPRJpUynAlVman0FfDt2hieyi-7U86aLqxsR10'; // Ваш ID таблицы

const EventModalComponent = ({ modalData, setModalData, selectedCalendars }) => {
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [serviceInfo, setServiceInfo] = useState(null); // Новый state для хранения услуги

  // Найти календарь, связанный с событием
  const calendarData = selectedCalendars.find(cal => cal.id === modalData?.organizer.email);

  // Функция для извлечения юзернейма из строки события
  const extractUsername = (summary) => {
    const match = summary.match(/@[\w_]+/); // Ищем строку, которая начинается с @ и состоит из букв, цифр или _
    return match ? match[0] : null;
  };

  // Функция для извлечения текста после "Услуга:" или "Услуги:"
  const extractServiceInfo = (text) => {
    const serviceMatch = text.match(/(?:Услуга|Услуги):\s*(.*)/i); // Ищем "Услуга:" или "Услуги:" и текст после них
    return serviceMatch ? serviceMatch[1] : 'Информация об услуге отсутствует';
  };

  // Функция для поиска информации на листах ПАРТНЕРЫ и ПОИСК
  const fetchInfoFromSheets = async () => {
    try {
      const ranges = [
        { sheet: 'ПАРТНЕРЫ', range: 'A:I' },  // Столбцы A-I
        { sheet: 'ПОИСК', range: 'A:C' },    // Столбцы A-C
      ];

      // Получаем данные с листов
      const sheetData = await fetchSheetData(spreadsheetId, ranges);

      // Извлекаем юзернейм из события
      const username = extractUsername(modalData?.summary);
      console.log(`Извлечённый юзернейм: ${username}`);

      if (!username) {
        console.log('Юзернейм не найден в событии.');
        return;
      }

      // Логирование полученных данных
      console.log('Полученные данные с листов:', sheetData);

      // Обрабатываем данные с листа ПАРТНЕРЫ
      const partnersSheet = sheetData.find(sheet => sheet.sheet === 'ПАРТНЕРЫ');
      if (partnersSheet) {
        console.log('Данные с листа ПАРТНЕРЫ:', partnersSheet.values);
      }

      if (partnersSheet && username) {
        console.log(`Поиск юзернейма: ${username} в колонке I`);
        // Ищем строку, где значение в колонке I совпадает с именем пользователя
        const matchingRow = partnersSheet.values.find(row => row[8]?.trim() === username);
        console.log('Найденная строка для партнера:', matchingRow);
        if (matchingRow) {
          const serviceDataRaw = matchingRow[6] || 'Информация об услуге отсутствует'; // Колонка G
          const serviceData = extractServiceInfo(serviceDataRaw); // Извлекаем информацию после "Услуга:"
          setServiceInfo(serviceData); // Сохраняем информацию об услуге
          console.log('Услуга:', serviceData);
        } else {
          console.log('Партнер не найден в листе ПАРТНЕРЫ.');
        }
      }

      // Обрабатываем данные с листа ПОИСК
      const searchSheet = sheetData.find(sheet => sheet.sheet === 'ПОИСК');
      if (searchSheet) {
        console.log('Данные с листа ПОИСК:', searchSheet.values);
      }

      if (searchSheet && username) {
        console.log(`Поиск юзернейма: ${username} в колонке C`);
        const matchingRow = searchSheet.values.find(row => row[2]?.trim() === username);
        console.log('Найденная строка для поиска:', matchingRow);
        if (matchingRow) {
          setSearchInfo(matchingRow[6]);
          console.log('Информация поиска:', matchingRow[6]);
        } else {
          console.log('Партнер не найден в листе ПОИСК.');
        }
      }
    } catch (error) {
      console.error('Ошибка при получении данных из Google Sheets:', error);
    }
  };

  // Загружаем информацию из Google Sheets, когда изменяется modalData
  useEffect(() => {
    if (modalData) {
      fetchInfoFromSheets();
    }
  }, [modalData]);

  return (
    <Modal
      title={modalData?.summary || 'Детали события'}
      open={!!modalData}  // Используем open вместо visible
      onCancel={() => setModalData(null)}
      footer={null}
    >
      {modalData && (
        <>
          <p><strong>Календарь:</strong> {calendarData?.summary || 'Не указано'}</p>
          <p><strong>Начало:</strong> {modalData.start.dateTime ? dayjs(modalData.start.dateTime).format('DD MMMM YYYY, HH:mm:ss') : 'Не указано'}</p>
          <p><strong>Конец:</strong> {modalData.end.dateTime ? dayjs(modalData.end.dateTime).format('DD MMMM YYYY, HH:mm:ss') : 'Не указано'}</p>
          {modalData.description && (
            <p><strong>Описание:</strong> <span dangerouslySetInnerHTML={{ __html: modalData.description }} /></p>
          )}

          {/* Отображаем информацию об услуге, если она найдена */}
          {serviceInfo && (
            <p><strong>Услуга:</strong> {serviceInfo}</p>
          )}

          {/* Отображаем данные с листа ПОИСК */}
          {searchInfo && (
            <p><strong>Информация поиска:</strong> {searchInfo}</p>
          )}

          <Button type="link" href={modalData.htmlLink} target="_blank">Посмотреть в Google Календаре</Button>
        </>
      )}
    </Modal>
  );
};

export default EventModalComponent;
