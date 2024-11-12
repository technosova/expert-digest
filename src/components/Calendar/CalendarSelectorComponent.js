import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';

const nameMapping = {
  'Саша TravelAsk': 'Саша',
  'Карина TravelAsk': 'Карина',
  'Марат TravelAsk': 'Марат',
  'Марина TravelAsk': 'Марина',
  'Маша TravelAsk': 'Маша',
  'Дмитрий TravelAsk': 'Дмитрий',
  'Travelask Даниил':'Даниил'
};

const CalendarSelectorComponent = ({ calendars, handleCalendarSelection }) => {
  const [selectedCalendars, setSelectedCalendars] = useState([]);

  // Загружаем сохраненные календари из localStorage только один раз при монтировании компонента
  useEffect(() => {
    const savedCalendars = JSON.parse(localStorage.getItem('selectedCalendars')) || [];
    setSelectedCalendars(savedCalendars);
    handleCalendarSelection(savedCalendars);
  }, []); // Пустой массив зависимостей, чтобы эффект выполнялся только при монтировании

  const onCalendarSelectionChange = (values) => {
    const selectedWithColors = values.map(id => {
      const calendar = calendars.find(cal => cal.id === id);
      return { ...calendar }; // Сохраняем всю информацию о календаре
    });

    setSelectedCalendars(selectedWithColors);
    handleCalendarSelection(selectedWithColors);

    // Сохраняем выбранные календари в localStorage
    localStorage.setItem('selectedCalendars', JSON.stringify(selectedWithColors));
  };

  return (
    <div>
      <h1>Выбор календарей</h1>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={selectedCalendars.map(cal => cal.id)}
        onChange={onCalendarSelectionChange}
      >
        {calendars.map(calendar => (
          <Checkbox key={calendar.id} value={calendar.id}>
            <span style={{ color: calendar.backgroundColor }}>■</span>
            {nameMapping[calendar.summary] || calendar.summary}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default CalendarSelectorComponent;
