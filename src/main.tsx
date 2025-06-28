import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Добавляем типы для глобального объекта Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

// Создаем корневой элемент
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 