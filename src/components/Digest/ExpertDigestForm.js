import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Typography, notification } from 'antd';
import { gapi } from 'gapi-script';

const { TextArea } = Input;
const { Title } = Typography;

const API_KEY = 'AIzaSyBcd5_84w91WHOK_OCiwnOL8L5WhMXyAa0';
const CLIENT_ID = '443926305689-3holk18bjkd54b21gi58i54r3e5a10th.apps.googleusercontent.com';
const SPREADSHEET_ID = '1xvVKJjQoO4Jk_i_nOvEIGR3O-wdDPuQ0w8OCPzawqZE'; // ID таблицы
const SPREADSHEET_LINK = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=0#gid=0`;
const RANGE = "'Лист1'!A2:E"; // Имя листа + диапазон данных

const initializeGAPI = () => {
  return gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });
};

const ExpertDigestForm = () => {
  const [digestNumber, setDigestNumber] = useState('');
  const [newExperts, setNewExperts] = useState('');
  const [featuredExperts, setFeaturedExperts] = useState('');
  const [bannedExperts, setBannedExperts] = useState('');
  const [removedExperts, setRemovedExperts] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);

  useEffect(() => {
    gapi.load('client', async () => {
      try {
        await initializeGAPI();
        setIsGapiInitialized(true);
      } catch (error) {
        console.error('Ошибка инициализации GAPI:', error);
      }
    });
  }, []);

  const fetchDigestData = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE, // Указываем диапазон с именем листа
      });

      const values = response.result.values;

      console.log('Загруженные данные из таблицы:', values);

      if (values) {
        // Находим максимальное значение в столбце A (номера дайджестов)
        const maxDigestNumber = Math.max(
          ...values.map(row => Number(row[0] || 0)) // Преобразуем значения в числа
        );

        setDigestNumber(maxDigestNumber); // Устанавливаем максимальное значение в инпут

        // Фильтруем строки, где номер дайджеста равен максимальному
        const filteredRows = values.filter(row => Number(row[0]) === maxDigestNumber);

        if (filteredRows.length > 0) {
          // Обрабатываем столбцы B, C, D, E
          const newExpertsData = filteredRows.map(row => row[1] || '').filter(Boolean).join('\n');
          const featuredExpertsData = filteredRows.map(row => row[2] || '').filter(Boolean).join('\n');
          const bannedExpertsData = filteredRows.map(row => row[3] || '').filter(Boolean).join('\n');
          const removedExpertsData = filteredRows.map(row => row[4] || '').filter(Boolean).join('\n');

          // Устанавливаем значения в соответствующие текстовые поля
          setNewExperts(newExpertsData);
          setFeaturedExperts(featuredExpertsData);
          setBannedExperts(bannedExpertsData);
          setRemovedExperts(removedExpertsData);

          notification.success({
            message: 'Данные подгружены',
            description: `Информация для дайджеста #${maxDigestNumber} успешно загружена.`,
          });
        } else {
          notification.warning({
            message: 'Данные не найдены',
            description: `Не удалось найти данные для дайджеста #${maxDigestNumber}.`,
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных из Google Sheets:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось получить данные из Google Sheets.',
      });
    }
  };

  const generateMessage = () => {
    const defaultNewExpertsMessage = "Итак, на этой неделе в ряды наших экспертов никто не вступил, но ожидаем пополнение на следующей)";
    const defaultFeaturedExpertsMessage = "Идем далее, на этой неделе у действующих экспертов не было новостей 🤓";
    const defaultRemovedExpertsMessage = "На этой неделе у нас не было отключений🥳";

    let message = `Экспертный дайджест #${digestNumber} 🔥\n\n` +
      "На календаре пятница, а это значит, что подъехал новый выпуск горячих новостей о наших партнерах. Присаживайтесь поудобнее🍿😎\n\n" +
      `${newExperts.trim() ? `**Итак, на этой неделе в ряды наших экспертов вступили:**\n${newExperts}` : defaultNewExpertsMessage}\n\n` +
      `${featuredExperts.trim() ? `**Идем далее, новости про действующих экспертов 🤓**\n${featuredExperts}` : defaultFeaturedExpertsMessage}\n\n`;

    if (bannedExperts.trim()) {
      message += `**К сожалению, на этой неделе у нас были баны:**\n${bannedExperts}\n\n`;
    }

    message += `${removedExperts.trim() ? `**И напоследок, те, с кем мы расстались:**\n${removedExperts}` : defaultRemovedExpertsMessage}\n\n` +
      "**До встречи в следующую пятницу!🔥**";

    setFinalMessage(message);
  };

  const copyToClipboard = (text) => {
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);

    notification.success({
      message: 'Успех!',
      description: 'Итоговое сообщение скопировано в буфер обмена.',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={2}>Экспертный дайджест</Title>
        <Button
          type="link"
          href={SPREADSHEET_LINK}
          target="_blank"
          style={{ fontSize: '16px', marginLeft: '10px' }}
        >
          Открыть Google Таблицу
        </Button>
      </div>

      <Form layout="vertical">
        <Form.Item 
          label="Номер дайджеста:"
          required
        >
          <Input 
            value={digestNumber} 
            onChange={(e) => setDigestNumber(e.target.value)} 
            placeholder="Введите номер дайджеста"
            disabled // Поле отключено, так как значение устанавливается автоматически
          />
          <Button 
            type="default" 
            onClick={fetchDigestData} 
            style={{ marginTop: '10px' }}
            disabled={!isGapiInitialized}
          >
            Подгрузить данные из Google Sheets
          </Button>
        </Form.Item>

        <Form.Item label="В ряды экспертов вступили:">
          <TextArea 
            value={newExperts} 
            onChange={(e) => setNewExperts(e.target.value)} 
            rows={5} 
            placeholder="Введите имена новых экспертов и их услуги"
          />
        </Form.Item>

        <Form.Item label="Героями выпуска стали:">
          <TextArea 
            value={featuredExperts} 
            onChange={(e) => setFeaturedExperts(e.target.value)} 
            rows={5} 
            placeholder="Введите изменения для действующих экспертов"
          />
        </Form.Item>

        <Form.Item label="К сожалению, у нас были баны:">
          <TextArea 
            value={bannedExperts} 
            onChange={(e) => setBannedExperts(e.target.value)} 
            rows={5} 
            placeholder="Введите имена и информацию о заблокированных аккаунтах"
          />
        </Form.Item>

        <Form.Item label="С кем расстались:">
          <TextArea 
            value={removedExperts} 
            onChange={(e) => setRemovedExperts(e.target.value)} 
            rows={5} 
            placeholder="Введите имена и причины расставания с партнёрами"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={generateMessage} disabled={!digestNumber}>
            Сгенерировать сообщение
          </Button>
        </Form.Item>
      </Form>

      {finalMessage && (
        <div style={{ marginTop: '20px' }}>
          <Title level={3}>Итоговое сообщение:</Title>
          <pre style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {finalMessage}
          </pre>
          <Button 
            type="default" 
            onClick={() => copyToClipboard(finalMessage)} 
            style={{ marginTop: '10px' }}
          >
            Копировать сообщение
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpertDigestForm;
