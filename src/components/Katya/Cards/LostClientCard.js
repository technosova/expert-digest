import React from 'react';
import { Card, Row, Col, Select, Button, notification, Tag, Input, Checkbox, DatePicker } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const LostClientCard = ({ title, month, setMonth, clients, setClients, includeClients, setIncludeClients }) => {

  // Формирование текста карточки для копирования
  const cardText = () => {
    let clientText = clients.map((client, index) => (
      `\n${index + 1}. Клиент: ${client.username}${client.service ? `, Услуга: ${client.service}` : ''}${client.dealDate ? `, Дата сделки: ${dayjs(client.dealDate).format('DD.MM.YYYY')}` : ''}${client.comment ? `, Комментарий от фин. отдела: ${client.comment}` : ''}`
    )).join('');

    let clientCount = clients.length;
    let introText = clientCount === 1 
      ? 'Также не удалось найти в фин. отчете следующего клиента:' 
      : 'Также не удалось найти в фин. отчете следующих клиентов:';

    let possibleMistakeText = clientCount === 1 
      ? 'Возможно, вы его как-то иначе внесли?' 
      : 'Возможно, вы их как-то иначе внесли?';

    let message = `Добрый день!\n\nФинансовый отдел просит актуализировать ваш отчет и еще раз проверить закрытые(оплаченные) периоды за ${month}, чтобы убедиться, что все совершенные сделки внесены. К сожалению, по информации фин. отдела были обнаружены недостающие сделки.\nПодскажите, пожалуйста, когда вы сможете это сделать?`;

    if (includeClients) {
      message += `\n\n${introText} ${clientText}\n\n${possibleMistakeText}\n\nПерепроверьте, пожалуйста, и внесите недостающие сделки. Сориентируйте, пожалуйста, когда сможете это сделать?`;
    }

    return message;
  };

  // Копирование текста карточки в буфер обмена
  const copyToClipboard = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = cardText();
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    
    notification.success({
      message: 'Скопировано!',
      description: 'Текст карточки успешно скопирован.',
    });
  };

  // Добавление нового блока клиента
  const addClientBlock = () => {
    setClients([...clients, { username: '', service: '', dealDate: null, comment: '' }]);
  };

  // Удаление блока клиента
  const removeClientBlock = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  // Обработка изменения полей клиента
  const handleClientChange = (index, field, value) => {
    const updatedClients = [...clients];
    updatedClients[index][field] = value;
    setClients(updatedClients);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card 
          title={title}
          bordered={false}
          extra={<Button onClick={copyToClipboard}>Копировать</Button>}
          actions={[
            <Tag color="magenta">#потеряшка</Tag>
          ]}
        >
          <p>Добрый день!</p>
          <p>
            Финансовый отдел просит актуализировать ваш отчет и еще раз проверить закрытые(оплаченные) периоды за{' '}
            <Select 
              value={month} 
              onChange={(value) => setMonth(value)} 
              style={{ width: '120px', marginLeft: '10px' }}
            >
              <Option value="январь">Январь</Option>
              <Option value="февраль">Февраль</Option>
              <Option value="март">Март</Option>
              <Option value="апрель">Апрель</Option>
              <Option value="май">Май</Option>
              <Option value="июнь">Июнь</Option>
              <Option value="июль">Июль</Option>
              <Option value="август">Август</Option>
              <Option value="сентябрь">Сентябрь</Option>
              <Option value="октябрь">Октябрь</Option>
              <Option value="ноябрь">Ноябрь</Option>
              <Option value="декабрь">Декабрь</Option>
            </Select>
            , чтобы убедиться, что все совершенные сделки внесены. К сожалению, по информации фин. отдела были обнаружены недостающие сделки.
          </p>
          <p>Подскажите, пожалуйста, когда вы сможете это сделать?</p>

          <Checkbox
            checked={includeClients}
            onChange={(e) => setIncludeClients(e.target.checked)}
          >
            Добавить клиентов и услуги
          </Checkbox>

          {includeClients && (
            <>
              <p><strong>{clients.length === 1 ? 'Также не удалось найти в фин. отчете следующего клиента:' : 'Также не удалось найти в фин. отчете следующих клиентов:'}</strong></p>
              
              {clients.map((client, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <Input 
                    placeholder="Имя клиента" 
                    value={client.username} 
                    onChange={(e) => handleClientChange(index, 'username', e.target.value)}
                    style={{ marginBottom: '5px' }}
                  />
                  <Input 
                    placeholder="Услуга (необязательно)" 
                    value={client.service} 
                    onChange={(e) => handleClientChange(index, 'service', e.target.value)}
                    style={{ marginBottom: '5px' }}
                  />
                  <DatePicker
                    placeholder="Дата сделки"
                    style={{ width: '100%', marginBottom: '5px' }}
                    value={client.dealDate ? dayjs(client.dealDate) : null}
                    onChange={(date) => handleClientChange(index, 'dealDate', date)}
                  />
                  <TextArea
                    placeholder="Дополнительный комментарий от фин. отдела (необязательно)"
                    value={client.comment}
                    onChange={(e) => handleClientChange(index, 'comment', e.target.value)}
                    rows={3}
                  />
                  <Button 
                    type="link" 
                    icon={<MinusCircleOutlined />} 
                    onClick={() => removeClientBlock(index)}
                    style={{ color: 'red', marginTop: '10px' }}
                  >
                    Удалить клиента
                  </Button>
                </div>
              ))}

              <Button 
                type="dashed" 
                onClick={addClientBlock} 
                style={{ width: '100%', marginTop: '10px' }}
              >
                <PlusOutlined /> Добавить клиента
              </Button>

              <p style={{ marginTop: '20px' }}>
                {clients.length === 1 ? 'Возможно, вы его как-то иначе внесли?' : 'Возможно, вы их как-то иначе внесли?'}
              </p>
              <p>
                Перепроверьте, пожалуйста, и внесите недостающие сделки. Сориентируйте, пожалуйста, когда сможете это сделать?
              </p>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default LostClientCard;
