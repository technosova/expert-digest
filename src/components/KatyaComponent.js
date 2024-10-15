import React, { useState } from 'react';
import { Row, Col, Input } from 'antd';
import LostClientCard from './LostClientCard'; // Импортируем компонент для карточки Потеряшка
import UnapprovedServiceCard from './UnapprovedServiceCard'; // Импортируем компонент для Несогласованные услуги
import Notes from './Notes'; // Импортируем компонент для заметок

const { Search } = Input;

const KatyaComponent = () => {
  const [month, setMonth] = useState('сентябрь');
  const [includeClients, setIncludeClients] = useState(false);

  // Состояние для данных клиентов в карточке Потеряшка
  const [clients, setClients] = useState([
    { username: '', service: '', dealDate: null, comment: '' }
  ]);

  // Состояние для данных услуги в карточке Несогласованные услуги
  const [service, setService] = useState({
    clientName: '',
    serviceName: '',
    clientPrice: '',
  });

  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // Обработка изменений данных клиента в LostClientCard
  const handleClientChange = (index, field, value) => {
    const updatedClients = clients.map((client, i) =>
      i === index ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
  };

  // Копирование данных из LostClientCard в буфер обмена
  const copyLostClientCard = () => {
    let clientText = clients.map((client, index) => (
      `Клиент: ${client.username}, Услуга: ${client.service}, Дата сделки: ${client.dealDate}, Комментарий: ${client.comment}`
    )).join('\n');
    const text = `
      Финансовый отдел просит актуализировать ваш отчет за ${month}. Недостающие сделки:
      ${clientText}
    `;
    navigator.clipboard.writeText(text);
    alert('Текст карточки скопирован');
  };

  // Обработка изменений данных услуги в UnapprovedServiceCard
  const handleServiceChange = (field, value) => {
    setService((prevService) => ({
      ...prevService,
      [field]: value
    }));
  };

  // Фильтрация карточек по заголовкам
  const filteredCards = [
    {
      title: 'Потеряшки',
      component: (
        <LostClientCard
          title="Потеряшки"
          month={month}
          setMonth={setMonth}
          clients={clients}
          setClients={setClients}
          includeClients={includeClients}
          setIncludeClients={setIncludeClients}
          copyToClipboard={copyLostClientCard} // Передаем логику копирования
        />
      )
    },
    {
      title: 'Несогласованные услуги',
      component: (
        <UnapprovedServiceCard
          service={service}
          handleServiceChange={handleServiceChange}
        />
      )
    }
  ].filter(card => card.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* Поисковая строка */}
      <Row style={{ marginBottom: '16px' }}>
        <Col span={16}>
          <Search
            placeholder="Поиск по заголовкам карточек"
            onChange={(e) => setSearchQuery(e.target.value)}
            enterButton
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          {/* Фильтрованные карточки */}
          {filteredCards.map((card, index) => (
            <div key={index}>
              {card.component}
            </div>
          ))}
        </Col>

        {/* Блок заметок */}
        <Col span={8}>
          <Notes />
        </Col>
      </Row>
    </>
  );
};

export default KatyaComponent;
