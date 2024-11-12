import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Menu, Button, Calendar } from 'antd';
import dayjs from 'dayjs';
import CalendarSelectorComponent from './CalendarSelectorComponent.js';
import EventsCalendarComponent from './EventsCalendarComponent.js';
import EventModalComponent from './EventModalComponent.js';
import { initializeGAPI, fetchCalendars, fetchEvents } from './api.js';
import './App.css';

const { Header, Content, Sider } = Layout;

const nameMapping = {
  'Саша TravelAsk': 'Саша',
  'Карина TravelAsk': 'Карина',
  'Марат TravelAsk': 'Марат',
  'Марина TravelAsk': 'Марина',
  'Маша TravelAsk': 'Маша',
  'Дмитрий TravelAsk': 'Дмитрий',
  'Travelask Даниил':'Даниил'
};

function CalendarEvent() {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1'); // Состояние для переключения компонентов
  const [collapsed, setCollapsed] = useState(true); // Состояние для сворачивания Sider

  // Загружаем сохраненные календари и события из localStorage
  useEffect(() => {
    const savedCalendars = JSON.parse(localStorage.getItem('selectedCalendars')) || [];
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    if (savedCalendars.length > 0) {
      setSelectedCalendars(savedCalendars);
    }
    if (savedEvents.length > 0) {
      setEvents(savedEvents);
    }
  }, []);

  // Инициализация GAPI
  useEffect(() => {
    function start() {
      if (window.gapi) {
        initializeGAPI().then(() => {
          window.gapi.auth2.getAuthInstance().signIn().then(() => {
            fetchCalendars().then(calendars => {
              setCalendars(calendars);
            }).catch(err => console.error('Ошибка загрузки календарей:', err));
          }).catch(err => console.error('Ошибка авторизации:', err));
        }).catch(err => console.error('Ошибка инициализации GAPI:', err));
      }
    }
    window.gapi.load('client:auth2', start);
  }, []);

  // Проверка перед загрузкой событий
  const loadEvents = useCallback(() => {
    if (!selectedCalendars || selectedCalendars.length === 0) {
      console.error('Календари не выбраны или не загружены.');
      return;
    }

    const startOfMonth = dayjs().startOf('month').toISOString();
    const endOfMonth = dayjs().endOf('month').toISOString();

    console.log('Загрузка событий для календарей:', selectedCalendars);

    setIsLoading(true);

    fetchEvents(selectedCalendars, startOfMonth, endOfMonth)
      .then(events => {
        const eventsWithCalendarInfo = events.map(event => {
          const calendarData = selectedCalendars.find(cal => cal.id === event.organizer.email);
          return {
            ...event,
            calendarSummary: calendarData?.summary || 'Не указано',
            calendarColor: calendarData?.backgroundColor || '#999', // Используем backgroundColor для цвета бейджа
          };
        });

        setEvents(eventsWithCalendarInfo);
        localStorage.setItem('events', JSON.stringify(eventsWithCalendarInfo));
      })
      .catch(error => {
        console.error('Ошибка при загрузке событий:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCalendars]);

  const saveCalendarsToLocalStorage = useCallback((calendars) => {
    localStorage.setItem('selectedCalendars', JSON.stringify(calendars));
  }, []);

  const handleCalendarSelection = useCallback((selected) => {
    setSelectedCalendars(selected);
    saveCalendarsToLocalStorage(selected);
  }, [saveCalendarsToLocalStorage]);

  const refreshEvents = () => {
    loadEvents();
  };

  // Функция для рендера компонента в зависимости от выбранного пункта меню
  const renderComponent = () => {
    switch (selectedMenu) {
      case '1':
        return (
          <>
            <CalendarSelectorComponent 
              calendars={calendars} 
              handleCalendarSelection={handleCalendarSelection} 
            />
            <Button 
              type="primary" 
              onClick={refreshEvents} 
              disabled={isLoading} 
              style={{ marginBottom: '16px' }}
            >
              {isLoading ? 'Загрузка...' : 'Загрузить события'}
            </Button>
            <EventsCalendarComponent 
              events={events} 
              setModalData={setModalData} 
              selectedCalendars={selectedCalendars} 
              nameMapping={nameMapping} 
            />
            <EventModalComponent 
              modalData={modalData} 
              setModalData={setModalData} 
              selectedCalendars={selectedCalendars} 
            />
          </>
        );
     
    }
  };

  return (
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {renderComponent()} {/* Динамически рендерим выбранный компонент */}
        </Content>
  );
}

export default CalendarEvent;
