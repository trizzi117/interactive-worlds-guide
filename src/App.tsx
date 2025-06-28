import React, { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { useGameStore } from '@/store/gameStore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Компоненты
import LoadingScreen from '@/components/LoadingScreen';
import WorldSelection from '@/components/WorldSelection';
import GameWorld from '@/components/GameWorld';
import DialogueScreen from '@/components/DialogueScreen';
import InventoryScreen from '@/components/InventoryScreen';
import QuestScreen from '@/components/QuestScreen';
import ErrorBoundary from '@/components/ErrorBoundary';
import TutorialOverlay from '@/components/TutorialOverlay';
import StartScreen from '@/components/StartScreen';

// Стили
import '@/styles/globals.css';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  const {
    player,
    currentWorld,
    currentDialogue,
    gameMode,
    isLoading,
    initializePlayer,
    setGameMode
  } = useGameStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[DEBUG] Начало инициализации приложения');
        // Проверяем наличие WebApp из Telegram или из SDK
        const telegramWebApp = window.Telegram?.WebApp || WebApp;
        
        if (telegramWebApp?.ready) {
          console.log('[DEBUG] WebApp доступен, вызываем ready()');
          telegramWebApp.ready();
        } else {
          console.log('[DEBUG] WebApp недоступен или метод ready() отсутствует');
        }
        
        // Настраиваем тему
        const isDark = telegramWebApp?.colorScheme === 'dark' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('[DEBUG] Тема:', isDark ? 'тёмная' : 'светлая');
        document.documentElement.classList.toggle('dark', isDark);
        
        const themeParams = telegramWebApp?.themeParams ?? {} as any;
        console.log('[DEBUG] themeParams:', themeParams);

        if (themeParams.bg_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color',
            themeParams.bg_color
          );
        }
        
        if (themeParams.text_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-text-color',
            themeParams.text_color
          );
        }
        
        if (themeParams.button_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-button-color',
            themeParams.button_color
          );
        }
        
        if (themeParams.button_text_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-button-text-color',
            themeParams.button_text_color
          );
        }

        // Инициализируем игрока, если данные пользователя доступны
        const tgUser = telegramWebApp?.initDataUnsafe?.user;
        console.log('[DEBUG] tgUser:', tgUser);

        if (tgUser) {
          console.log('[DEBUG] Инициализация игрока с данными пользователя');
          initializePlayer(tgUser);
        } else {
          // Если пользователь не авторизован, создаем временного игрока
          console.log('[DEBUG] Создание временного игрока');
          initializePlayer({
            id: Date.now(),
            first_name: 'Путник'
          });
        }

        // Настраиваем кнопки Telegram (если доступны)
        if (telegramWebApp?.MainButton) {
          console.log('[DEBUG] MainButton доступна');
          telegramWebApp.MainButton.setText('Меню');
          telegramWebApp.MainButton.onClick(() => {
            setGameMode('exploration');
          });
        }
        else {
          console.log('[DEBUG] MainButton недоступна');
        }

        if (telegramWebApp?.BackButton) {
          console.log('[DEBUG] BackButton доступна');
          telegramWebApp.BackButton.onClick(() => {
            if (gameMode === 'dialogue' || gameMode === 'inventory' || gameMode === 'quest' || gameMode === 'tutorial') {
              setGameMode('exploration');
            }
          });
        }
        else {
          console.log('[DEBUG] BackButton недоступна');
        }

        // Настраиваем главную кнопку для перехода в Mini App
        try {
          if (telegramWebApp?.MainButton) {
            telegramWebApp.MainButton.setText('Открыть приключение');
            telegramWebApp.MainButton.show();
            telegramWebApp.MainButton.onClick(() => {
              console.log('[DEBUG] Нажата главная кнопка для открытия Mini App');
            });
          }
        } catch (e) {
          console.error('[DEBUG] Ошибка при настройке главной кнопки:', e);
        }

        console.log('[DEBUG] Инициализация завершена, устанавливаем isInitialized = true');
        setIsInitialized(true);

        // Проверяем, не первый ли раз пользователь открывает приложение
        // Если пользователь уже играл, пропускаем начальный экран
        if (player && player.visitedLocations.length > 0) {
          setShowStartScreen(false);
        }
      } catch (err) {
        console.error('Ошибка инициализации приложения:', err);
        console.error('[DEBUG] Стек ошибки:', err instanceof Error ? err.stack : 'Нет стека');
        // Даже при ошибке инициализации WebApp пытаемся запустить приложение
        console.log('[DEBUG] Пытаемся продолжить работу приложения, несмотря на ошибку');
        initializePlayer({
          id: Date.now(),
          first_name: 'Гость'
        });
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    console.log('[DEBUG] Изменение gameMode:', gameMode);
    // Проверяем наличие WebApp из Telegram или из SDK
    const telegramWebApp = window.Telegram?.WebApp || WebApp;
    const mainButton = telegramWebApp?.MainButton;
    const backButton = telegramWebApp?.BackButton;

    if (!mainButton || !backButton) return;

    if (gameMode === 'exploration') {
      mainButton.hide();
      backButton.hide();
    } else {
      mainButton.show();
      backButton.show();
    }
  }, [gameMode]);

  // Отладочный вывод состояния приложения
  useEffect(() => {
    console.log('[DEBUG] Состояние приложения:', {
      isInitialized,
      isLoading,
      error,
      player: player ? {
        id: player.id,
        name: player.name,
        currentWorld: player.currentWorld
      } : null,
      currentWorld: currentWorld ? {
        id: currentWorld.id,
        name: currentWorld.name,
        locationsCount: currentWorld.locations.length
      } : null,
      gameMode
    });
  }, [isInitialized, isLoading, error, player, currentWorld, gameMode]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-900 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
            Ошибка
          </h1>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }
  
  // Функция для отображения контента в зависимости от режима игры
  const renderGameContent = () => {
    switch (gameMode) {
      case 'dialogue':
        return <DialogueScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'quest':
        return <QuestScreen />;
      default:
        return null;
    }
  };

  // Если показываем стартовый экран
  if (showStartScreen) {
    return (
      <ErrorBoundary>
        <StartScreen onStartGame={() => setShowStartScreen(false)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  !currentWorld ? (
                    <motion.div
                      key="world-selection"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WorldSelection />
                    </motion.div>
                  ) : (
                    <Navigate to="/game" replace />
                  )
                }
              />
              
              <Route
                path="/game"
                element={
                  currentWorld ? (
                    <motion.div
                      key="game-world"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GameWorld />
                      {renderGameContent()}
                    </motion.div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          
          {/* Оверлей для обучения будет отображен поверх всего интерфейса */}
          <TutorialOverlay />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 