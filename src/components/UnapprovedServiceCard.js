import React from 'react';
import { Card, Input, Button, notification } from 'antd';

const UnapprovedServiceCard = ({
  service = {},  // Объект service по умолчанию инициализирован
  handleServiceChange,
}) => {
  // Функция копирования данных в буфер обмена с уведомлением
  const copyToClipboard = () => {
    // Формируем текст для копирования, используя введенные данные
    const text = `
      Добрый день!

      Заметили, что в чате с клиентом ${service.clientName || 'имя клиента'} вы обсуждали ранее несогласованную услугу ${service.serviceName || 'название услуги'}, стоимостью ${service.clientPrice || 'цена'}. Напоминаем вам, что не согласованные услуги предлагать и оказывать клиентам вы не можете до их согласования, это запрещено нашими правилами. Пришлите, пожалуйста, данную услугу по нашему формату, отправлю на согласование в фин. отдел.

      Напишите, пожалуйста, в цифрах:
      Услуга -
      Страна, где она оказывается -  
      Цена для клиента - 
      Себестоимость - 
      Состав себестоимости - 

      Комиссия ТревелАск % от прибыли (Прибыль = цена - себестоимость) - 
      Пожалуйста, указывайте валюту💵, в которой написаны цены.
      ⚠️В других форматах фин. отдел прайсы не принимает.
    `;

    navigator.clipboard.writeText(text);
    
    notification.success({
      message: 'Успешно скопировано!',
      description: 'Текст карточки скопирован в буфер обмена.',
      placement: 'topRight',
    });
  };

  return (
    <Card
      title="Несогласованные услуги"
      bordered={false}
      extra={<Button onClick={copyToClipboard}>Копировать</Button>}
    >
      <p>Добрый день!</p>
      <p>
        Заметили, что в чате с клиентом{' '}
        <Input
          placeholder="Имя клиента"
          value={service.clientName || ''}  // Имя клиента из инпута
          onChange={(e) => handleServiceChange('clientName', e.target.value)}  // Обновление имени клиента
          style={{ width: '300px', marginRight: '10px' }}
        /> 
        вы обсуждали ранее несогласованную услугу{' '}
        <Input
          placeholder="Название услуги"
          value={service.serviceName || ''}  // Название услуги из инпута
          onChange={(e) => handleServiceChange('serviceName', e.target.value)}  // Обновление названия услуги
          style={{ width: '300px', marginRight: '10px' }}
        />
        , стоимостью{' '}
        <Input
          placeholder="Цена для клиента"
          value={service.clientPrice || ''}  // Цена для клиента из инпута
          onChange={(e) => handleServiceChange('clientPrice', e.target.value)}  // Обновление цены для клиента
          style={{ width: '120px' }}
        /> евро.
      </p>
      <p>
        Напоминаем вам, что не согласованные услуги предлагать и оказывать клиентам вы не можете до их согласования, это запрещено нашими правилами. Пришлите, пожалуйста, данную услугу по нашему формату, отправлю на согласование в фин. отдел.
      </p>

      <p style={{ marginTop: '20px' }}>
        Напишите, пожалуйста, в цифрах:
      </p>
      <ul>
        <li>Услуга</li>
        <li>Страна, где она оказывается</li>
        <li>Цена для клиента</li>
        <li>Себестоимость</li>
        <li>Состав себестоимости</li>
        <li>Комиссия ТревелАск % от прибыли (Прибыль = цена - себестоимость)</li>
      </ul>

      <p>
        Пожалуйста, указывайте валюту💵, в которой написаны цены.
      </p>
      <p>
        ⚠️ В других форматах фин. отдел прайсы не принимает.
      </p>
    </Card>
  );
};

export default UnapprovedServiceCard;
