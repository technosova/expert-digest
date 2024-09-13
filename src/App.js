import React, { useState } from 'react';
import { Input, Button, Form, Typography, notification } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const ExpertDigestForm = () => {
  const [digestNumber, setDigestNumber] = useState('');
  const [newExperts, setNewExperts] = useState('');
  const [featuredExperts, setFeaturedExperts] = useState('');
  const [bannedExperts, setBannedExperts] = useState('');
  const [removedExperts, setRemovedExperts] = useState('');
  const [finalMessage, setFinalMessage] = useState('');

  const generateMessage = () => {
    const defaultNewExpertsMessage = "Итак, на этой неделе в ряды наших экспертов никто не вступил, но ожидаем пополнение на следующей)";
    const defaultFeaturedExpertsMessage = "Идем далее, на этой неделе у действующих экспертов не было новостей 🤓";
    const defaultRemovedExpertsMessage = "На этой неделе у нас не было отключений🥳";

    // Формируем итоговое сообщение с одинаковыми отступами
    let message = `Экспертный дайджест #${digestNumber} 🔥\n\n` +
      "На календаре пятница, а это значит, что подъехал новый выпуск горячих новостей о наших партнерах. Присаживайтесь поудобнее🍿😎\n\n" +
      `${newExperts.trim() ? `**Итак, на этой неделе в ряды наших экспертов вступили:**\n${newExperts}` : defaultNewExpertsMessage}\n\n` +
      `${featuredExperts.trim() ? `**Идем далее, новости про действующих экспертов 🤓**\n${featuredExperts}` : defaultFeaturedExpertsMessage}\n\n`;

    // Добавляем блок с банами, если он есть
    if (bannedExperts.trim()) {
      message += `**К сожалению, на этой неделе у нас были баны:**\n${bannedExperts}\n\n`;
    }

    // Добавляем блок с удалёнными экспертами
    message += `${removedExperts.trim() ? `**И напоследок, те, с кем мы расстались:**\n${removedExperts}` : defaultRemovedExpertsMessage}\n\n` +
      "**До встречи в следующую пятницу!🔥**";

    setFinalMessage(message); // Без trim, чтобы сохранить все отступы
    copyToClipboard(message);  // Копируем итоговое сообщение в буфер обмена
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
      placement: 'top',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Экспертный дайджест</Title>

      <Form layout="vertical">
        <Form.Item 
          label="Номер дайджеста:"
          required
          validateStatus={digestNumber ? 'success' : 'error'}
          help={!digestNumber && "Пожалуйста, введите номер дайджеста"}
        >
          <Input 
            value={digestNumber} 
            onChange={(e) => setDigestNumber(e.target.value)} 
            placeholder="Введите номер дайджеста"
          />
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
            Сгенерировать и скопировать сообщение
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
        </div>
      )}
    </div>
  );
};

export default ExpertDigestForm;
