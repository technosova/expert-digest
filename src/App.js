import React, { useState } from 'react';
import { Input, Button, Form, Typography, notification } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const ExpertDigestForm = () => {
  const [digestNumber, setDigestNumber] = useState('');
  const [newExperts, setNewExperts] = useState('');
  const [featuredExperts, setFeaturedExperts] = useState('');
  const [removedExperts, setRemovedExperts] = useState('');
  const [finalMessage, setFinalMessage] = useState('');

  const generateMessage = () => {
    const defaultNewExpertsMessage = "Итак, на этой неделе в ряды наших экспертов никто не вступил, но ожидаем пополнение на следующей)";
    const defaultRemovedExpertsMessage = "На этой неделе у нас не было отключений🥳";

    // Создаем итоговое сообщение с правильным форматированием
    const message = `
Экспертный дайджест #${digestNumber} 🔥

На календаре пятница, а это значит, что подъехал новый выпуск горячих новостей о наших партнерах. 
Присаживайтесь поудобнее🍿😎

${newExperts.trim() ? `Итак, на этой неделе в ряды наших экспертов вступили:\n${newExperts}` : defaultNewExpertsMessage}

**Идем далее, новости про действующих экспертов 🤓**
Героями выпуска стали: 

${featuredExperts.trim() ? `${featuredExperts}` : ''}

**И напоследок, те, с кем мы расстались:**
${removedExperts.trim() ? `${removedExperts}` : defaultRemovedExpertsMessage}

**До встречи в следующую пятницу!🔥**
    `;

    setFinalMessage(message);
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
        <Form.Item label="Номер дайджеста:">
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

        <Form.Item label="С кем расстались:">
          <TextArea 
            value={removedExperts} 
            onChange={(e) => setRemovedExperts(e.target.value)} 
            rows={5} 
            placeholder="Введите имена и причины расставания с партнёрами"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={generateMessage}>
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
