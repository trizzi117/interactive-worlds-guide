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

// Стили
import '@/styles/globals.css';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        // Инициализируем Telegram Web App
        WebApp.ready();
        
        // Настраиваем тему
        const isDark = WebApp.colorScheme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        
        // Устанавливаем цвета из Telegram
        if (WebApp.themeParams.bg_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color',
            WebApp.themeParams.bg_color
          );
        }
        
        if (WebApp.themeParams.text_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-text-color',
            WebApp.themeParams.text_color
          );
        }
        
        if (WebApp.themeParams.button_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-button-color',
            WebApp.themeParams.button_color
          );
        }
        
        if (WebApp.themeParams.button_text_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-button-text-color',
            WebApp.themeParams.button_text_color
          );
        }

        // Инициализируем игрока, если данные пользователя доступны
        if (WebApp.initDataUnsafe.user) {
          initializePlayer(WebApp.initDataUnsafe.user);
        } else {
          // Если пользователь не авторизован, создаем временного игрока
          initializePlayer({
            id: Date.now(),
            first_name: 'Путник'
          });
        }

        // Настраиваем кнопки Telegram
        WebApp.MainButton.setText('Меню');
        WebApp.MainButton.onClick(() => {
          setGameMode('exploration');
        });

        // Настраиваем кнопку "Назад"
        WebApp.BackButton.onClick(() => {
          if (gameMode === 'dialogue') {
            setGameMode('exploration');
          } else if (gameMode === 'inventory') {
            setGameMode('exploration');
          } else if (gameMode === 'quest') {
            setGameMode('exploration');
          }
        });

        setIsInitialized(true);
      } catch (err) {
        console.error('Ошибка инициализации приложения:', err);
        setError('Ошибка инициализации приложения');
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Обновляем видимость кнопок в зависимости от режима игры
    if (gameMode === 'exploration') {
      WebApp.MainButton.hide();
      WebApp.BackButton.hide();
    } else {
      WebApp.MainButton.show();
      WebApp.BackButton.show();
    }
  }, [gameMode]);

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
                      {gameMode === 'dialogue' && currentDialogue ? (
                        <DialogueScreen />
                      ) : gameMode === 'inventory' ? (
                        <InventoryScreen />
                      ) : gameMode === 'quest' ? (
                        <QuestScreen />
                      ) : (
                        <GameWorld />
                      )}
                    </motion.div>
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 