import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, AlertCircle, Check } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { gameDifficulty, setGameDifficulty, startTutorial } = useGameStore();

  const difficultyOptions = [
    {
      id: 'easy',
      name: 'Легкая',
      description: 'Подробное обучение и подсказки. Рекомендуется для новичков.',
      icon: <HelpCircle className="text-green-500" />
    },
    {
      id: 'medium',
      name: 'Средняя',
      description: 'Базовые подсказки и обучение. Баланс между помощью и исследованием.',
      icon: <Check className="text-blue-500" />
    },
    {
      id: 'hard',
      name: 'Сложная',
      description: 'Минимум подсказок. Для опытных игроков, которые предпочитают самостоятельное исследование.',
      icon: <AlertCircle className="text-red-500" />
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Настройки
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Сложность игры
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Выберите уровень сложности, который определяет количество подсказок и помощи
              </p>

              <div className="space-y-3">
                {difficultyOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${gameDifficulty === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    onClick={() => setGameDifficulty(option.id as any)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Обучение
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Повторите обучение или посмотрите подсказки по игровым механикам
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => startTutorial(), 300);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Запустить обучение
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-md transition-colors"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal; 