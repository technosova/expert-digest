import React, { useState } from 'react';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { sanitizeUsername } from './utils';
import DataLoader from './DataLoader';

const extractServiceInfo = (serviceText) => {
  const match = serviceText.match(/Имя:\s*(.*)/);
  return match ? match[1].trim() : serviceText;
};

const extractLink = (description) => {
  const match = description && description.match(/https?:\/\/[^\s">]+/);
  return match ? match[0] : '';
};

// Преобразование имени в творительный падеж
const toInstrumental = (name) => {
  const instrumentalNames = {
    'Саша': 'Сашей',
    'Дмитрий': 'Димой',
    'Карина': 'Кариной',
    'Маша': 'Машей',
    'Даниил': 'Даней', // Изменено на короткую форму "Даня" в творительном падеже
    'Дима': 'Димой',
    // Добавьте другие имена по мере необходимости
  };
  return instrumentalNames[name] || name;
};

const CopyEventsButton = ({ dayEvents, selectedCalendars, nameMapping }) => {
  const [services, setServices] = useState({});

  const handleDataLoaded = (data) => {
    localStorage.setItem('partnersData', JSON.stringify(data.partnersData));
    localStorage.setItem('searchData', JSON.stringify(data.searchData));
  };

  const extractUsername = (summary) => {
    const match = summary.match(/@[\w_]+/);
    return match ? sanitizeUsername(match[0]) : null;
  };

  const findServiceForUser = (username) => {
    const partnersData = JSON.parse(localStorage.getItem('partnersData')) || [];
    const searchData = JSON.parse(localStorage.getItem('searchData')) || [];

    for (const row of partnersData) {
      const usernamesCell = row[8];
      if (usernamesCell) {
        const usernames = usernamesCell.split(/[\s\n\r\t]+/).map(u => sanitizeUsername(u));
        if (usernames.includes(username)) {
          const serviceInfo = extractServiceInfo(row[6]);
          return `Наш партнер: ${serviceInfo || 'Услуга не указана'}`;
        }
      }
    }

    for (const row of searchData) {
      const usernamesCell = row[0];
      if (usernamesCell) {
        const usernames = usernamesCell.split(/[\s\n\r\t]+/).map(u => sanitizeUsername(u));
        if (usernames.includes(username)) {
          const serviceInfo = row[4];
          return serviceInfo || 'Услуга не указана';
        }
      }
    }

    return 'Услуга не указана';
  };

  const copyEvents = async () => {
    const eventsByCalendar = {};
    const jointCalls = {}; // Для хранения информации о совместных звонках

    for (let i = 0; i < dayEvents.length; i++) {
      const event = dayEvents[i];
      const calendarData = selectedCalendars.find(cal => cal.id === event.organizer.email);
      const calendarName = nameMapping[calendarData?.summary] || calendarData?.summary || 'Не указано';
      const eventStartTime = event.start.dateTime
        ? dayjs(event.start.dateTime).tz('Europe/Moscow').format('HH:mm')
        : 'Время не указано';

      const username = extractUsername(event.summary);
      let service = services[event.id];
      if (!service && username) {
        service = findServiceForUser(username);
        setServices((prev) => ({ ...prev, [event.id]: service }));
      }

      const link = extractLink(event.description);
      const linkText = link ? ` [${service}](${link})` : ` ${service}`;
      const eventText = `${eventStartTime} ${username}${linkText}`;

      if (!eventsByCalendar[calendarName]) {
        eventsByCalendar[calendarName] = [];
      }
      eventsByCalendar[calendarName].push({ time: eventStartTime, text: eventText, username });

      for (let j = i + 1; j < dayEvents.length; j++) {
        const otherEvent = dayEvents[j];
        const otherCalendarData = selectedCalendars.find(cal => cal.id === otherEvent.organizer.email);
        const otherCalendarName = nameMapping[otherCalendarData?.summary] || otherCalendarData?.summary || 'Не указано';
        const otherEventStartTime = otherEvent.start.dateTime
          ? dayjs(otherEvent.start.dateTime).tz('Europe/Moscow').format('HH:mm')
          : 'Время не указано';

        const otherUsername = extractUsername(otherEvent.summary);

        // Проверяем совпадение по времени и username
        if (eventStartTime === otherEventStartTime && username === otherUsername && calendarName !== otherCalendarName) {
          const jointKey = `${eventStartTime}_${username}_${calendarName}_${otherCalendarName}`;
          
          if (!jointCalls[jointKey]) {
            jointCalls[jointKey] = [
              { caller: calendarName, participant: otherCalendarName, time: eventStartTime, participantUsername: otherUsername },
              { caller: otherCalendarName, participant: calendarName, time: eventStartTime, participantUsername: username }
            ];
          }
        }
      }
    }

    let messageText = `@mariia-meshcheriakova @aleksandr-tokmakov @karina-khalikova @dmitrii-larichkov @daniil-baranov\nДоброе утро! Созвоны на сегодня:\n\n`;

    for (const [calendarName, events] of Object.entries(eventsByCalendar)) {
      messageText += `${calendarName}:\n`;
      events.forEach(({ time, text, username }) => {
        const jointCall = Object.values(jointCalls).flat().find(
          joint => joint.caller === calendarName && joint.time === time && joint.participantUsername === username
        );

        const jointInfo = jointCall
          ? ` совместный звонок с ${toInstrumental(jointCall.participant)}`
          : '';

        messageText += `${text}${jointInfo}\n`;
      });
      messageText += '\n';
    }

    navigator.clipboard.writeText(messageText).then(() => {
      message.success('События скопированы в буфер обмена');
    }).catch(() => {
      message.error('Не удалось скопировать события');
    });
  };

  return (
    <div>
      <Button 
        onClick={copyEvents} 
        icon={<CopyOutlined />}
      >
      </Button>
      <DataLoader onDataLoaded={handleDataLoaded} />
    </div>
  );
};

export default CopyEventsButton;
