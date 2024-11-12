import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Switch } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import CopyEventsComponent from './CopyEventsComponent';
import './EventsCalendarComponent.css';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru'); // Устанавливаем локализацию dayjs на русский

const EventsCalendarComponent = ({ events, setModalData, selectedCalendars = [], nameMapping }) => {
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight);
  const [showWeekends, setShowWeekends] = useState(false); // Состояние для переключения режимов

  useEffect(() => {
    const handleResize = () => {
      setCalendarHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Проверка, показывать ли день (суббота и воскресенье не отображаются в режиме рабочих дней)
  const shouldShowDay = (date) => {
    const dayOfWeek = date.day();
    if (!showWeekends && (dayOfWeek === 6 || dayOfWeek === 0)) { // 6 - суббота, 0 - воскресенье
      return false; // Не показывать выходные
    }
    return true; // Показывать день
  };

  const cellRender = (date) => {
    // Если день не должен отображаться, возвращаем null для скрытия
    if (!shouldShowDay(date)) {
      return <div style={{ visibility: 'hidden' }}></div>; // Скрываем ячейки
    }

    const formattedDate = date.format('YYYY-MM-DD');
    const dayEvents = events.filter(event => {
      const eventDate = dayjs(event.start.dateTime || event.start.date).format('YYYY-MM-DD');
      return eventDate === formattedDate && event.summary ;
    });

    return (
      <div className="calendar-cell-content">
        {/* Контейнер для кнопки копирования */}
        <div className="copy-button-container">
          {dayEvents.length > 0 && (
            <CopyEventsComponent 
              dayEvents={dayEvents} 
              selectedCalendars={selectedCalendars} 
              nameMapping={nameMapping} 
            />
          )}
        </div>
        <ul className="events">
          {dayEvents.map(event => {
            const eventStartTime = event.start.dateTime 
              ? dayjs(event.start.dateTime).tz('Europe/Moscow').format('HH:mm') 
              : 'Время не указано';

            const calendarData = selectedCalendars.find(cal => cal.id === event.organizer.email);
            const calendarColor = calendarData?.backgroundColor || 'gray';
            const calendarName = nameMapping[calendarData?.summary] || calendarData?.summary || 'Не указано';

            const handleEventClick = () => {
              setModalData({
                ...event,
                calendarSummary: calendarName,
              });
            };

            return (
              <li key={event.id} onClick={handleEventClick} style={{ cursor: 'pointer' }}>
                <Badge 
                  color={calendarColor} 
                  text={`${eventStartTime} ${event.summary} (${calendarName})`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ height: calendarHeight, display: 'flex', flexDirection: 'column' }}>
      {/* Переключатель для отображения выходных */}
      <div style={{ marginBottom: '16px' }}>
        <Switch 
          checked={showWeekends}
          onChange={() => setShowWeekends(!showWeekends)}
          checkedChildren="Показывать выходные"
          unCheckedChildren="Только рабочие дни"
        />
      </div>
      <Calendar 
        cellRender={cellRender}
        locale={locale}
        style={{ flexGrow: 1 }}
        className={`full-screen-calendar ${!showWeekends ? 'hide-weekends' : ''}`}
      />
    </div>
  );
};

export default EventsCalendarComponent;
