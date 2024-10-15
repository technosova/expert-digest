import React from 'react';
import { Card, Row, Col } from 'antd';

const VikaComponent = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Карточка A" bordered={false}>
          Содержимое карточки A
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Карточка B" bordered={false}>
          Содержимое карточки B
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Карточка C" bordered={false}>
          Содержимое карточки C
        </Card>
      </Col>
    </Row>
  );
};

export default VikaComponent;
