import React from 'react';
import { motion } from 'framer-motion';
import { Play, MapPin, BookOpen, Package, User, Info, Settings, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const { startTutorial } = useGameStore();

  // Анимация пульсации для кнопки
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    ]
  };

  // Функции для игровых механик
  const gameFeatures = [
    {
      title: 'Исследуйте миры',
      description: 'Посетите различные локации с уникальными персонажами и историями',
      icon: MapPin,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      title: 'Выполняйте квесты',
      description: 'Помогайте персонажам и получайте награды за выполнение заданий',
      icon: BookOpen,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    },
    {
      title: 'Собирайте предметы',
      description: 'Находите ценные артефакты и используйте их в своих приключениях',
      icon: Package,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 flex flex-col justify-between">
      <header className="max-w-4xl mx-auto w-full pt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            Интерактивный Путеводитель
          </div>
          <Settings className="w-7 h-7 text-gray-500 dark:text-gray-300" />
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-4">
        {/* Основной контент */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Начните своё приключение!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Исследуйте удивительные миры, взаимодействуйте с персонажами и выполняйте увлекательные квесты
          </p>
        </motion.div>

        {/* Кнопка начала игры */}
        <motion.div
          className="mb-16 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={pulseAnimation}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={onStartGame}
          >
            <Play className="mr-2" size={24} />
            Начать игру
          </motion.button>
          
          {/* Подсказка */}
          <motion.p 
            className="mt-4 text-gray-500 dark:text-gray-400 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Info size={16} className="mr-2" />
            Нажмите, чтобы выбрать мир и начать своё приключение!
          </motion.p>
          
          {/* Кнопка обучения */}
          <motion.button
            className="mt-8 text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center hover:underline"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              startTutorial();
              onStartGame();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <HelpCircle className="mr-2" size={18} />
            Показать обучение
          </motion.button>
        </motion.div>

        {/* Основные возможности */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {gameFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full px-4 py-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Для лучшего опыта рекомендуем начать с обучения</p>
        </motion.div>
      </footer>
    </div>
  );
};

export default StartScreen; 