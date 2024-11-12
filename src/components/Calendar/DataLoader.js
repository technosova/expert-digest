import React, { useEffect, useState } from 'react';
import { initializeGAPI, fetchSheetData } from './api';

const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 минут

const DataLoader = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Проверяем наличие данных в localStorage и не истек ли срок их действия
        const cachedData = JSON.parse(localStorage.getItem('sheetData'));
        const cacheTimestamp = localStorage.getItem('cacheTimestamp');
        const now = new Date().getTime();

        if (cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_EXPIRATION_TIME) {
          onDataLoaded(cachedData);
          setLoading(false);
          return;
        }

        await initializeGAPI();

        // Загружаем данные с листа "ПАРТНЕРЫ"
        const sheetData1 = await fetchSheetData('1ACXyzSPRJpUynAlVman0FfDt2hieyi-7U86aLqxsR10', [
          { sheet: 'ПАРТНЕРЫ', range: 'ПАРТНЕРЫ!A:I' }
        ]);

        // Загружаем данные с листа "ПОИСК"
        const sheetData2 = await fetchSheetData('1ACXyzSPRJpUynAlVman0FfDt2hieyi-7U86aLqxsR10', [
          { sheet: 'ПОИСК', range: 'ПОИСК!C:G' }
        ]);

        const data = {
          partnersData: sheetData1.length ? sheetData1[0].values : [],
          searchData: sheetData2.length ? sheetData2[0].values : []
        };

        // Сохраняем данные и время кеширования
        localStorage.setItem('sheetData', JSON.stringify(data));
        localStorage.setItem('cacheTimestamp', now);

        onDataLoaded(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных с листов:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [onDataLoaded]);

  return loading ? <p>Загрузка данных...</p> : null;
};

export default DataLoader;
