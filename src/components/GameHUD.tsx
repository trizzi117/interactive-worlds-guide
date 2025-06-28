import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  BookOpen, 
  Package, 
  MessageCircle, 
  Settings, 
  HelpCircle, 
  X,
  Menu,
  Compass,
  Star,
  ChevronUp
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface GameHUDProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const GameHUD: React.FC<GameHUDProps> = ({ onTabChange, activeTab }) => {
  const { setGameMode, startTutorial, gameDifficulty } = useGameStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { id: 'inventory', label: 'Инвентарь', icon: Package, mode: 'inventory' },
    { id: 'settings', label: 'Настройки', icon: Settings, mode: 'settings' },
    { id: 'tutorial', label: 'Обучение', icon: HelpCircle, mode: 'tutorial' }
  ];

  const tabItems = [
    { id: 'locations', label: 'Локации', icon: MapPin },
    { id: 'characters', label: 'Персонажи', icon: MessageCircle },
    { id: 'quests', label: 'Квесты', icon: BookOpen }
  ];
  
  // Должны ли мы показывать подсказки в зависимости от выбранной сложности
  const shouldShowHints = gameDifficulty !== 'hard';

  // Функция для переключения вкладок
  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false); // Закрываем меню при переключении вкладки
  };

  // Функция для действий пунктов меню
  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false);
    
    if (action === 'inventory') {
      setGameMode('inventory');
    } else if (action === 'settings') {
      setGameMode('settings');
    } else if (action === 'tutorial') {
      startTutorial();
    }
  };

  return (
    <>
      {/* Нижняя навигация для мобильных устройств */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-t-lg border-t border-gray-200 dark:border-gray-700 p-2 z-30 lg:hidden"
      >
        <div className="flex justify-around">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center p-2 rounded-md ${
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <tab.icon size={22} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center p-2 rounded-md text-gray-500 dark:text-gray-400"
          >
            <Menu size={22} />
            <span className="text-xs mt-1">Меню</span>
          </button>
        </div>
      </motion.div>

      {/* Всплывающее меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-16 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-40 lg:hidden"
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">Меню игры</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleMenuAction(item.id)}
                  className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <item.icon size={24} className="text-blue-500 mb-2" />
                  <span className="text-xs text-gray-800 dark:text-gray-200">{item.label}</span>
                </button>
              ))}
            </div>
            {shouldShowHints && (
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
                Нажмите на элемент, чтобы выбрать действие
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Всплывающие подсказки для новых игроков (для настольной версии) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:block fixed bottom-5 right-5 space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => startTutorial()}
          className="bg-blue-500 p-3 rounded-full shadow-lg text-white tooltip"
          data-tooltip="Показать обучение"
        >
          <HelpCircle size={24} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMenuAction('settings')}
          className="bg-gray-700 dark:bg-gray-600 p-3 rounded-full shadow-lg text-white tooltip"
          data-tooltip="Настройки"
        >
          <Settings size={24} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMenuAction('inventory')}
          className="bg-purple-600 dark:bg-purple-700 p-3 rounded-full shadow-lg text-white tooltip"
          data-tooltip="Инвентарь"
        >
          <Package size={24} />
        </motion.button>
      </motion.div>

      {/* Индикатор важных локаций или персонажей (опционально для easy mode) */}
      {gameDifficulty === 'easy' && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-5 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block"
        >
          <div className="flex flex-col space-y-3">
            <div 
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer tooltip" 
              data-tooltip="Важная локация"
              onClick={() => handleTabChange('locations')}
            >
              <Compass size={24} className="text-blue-500" />
            </div>
            <div 
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer tooltip" 
              data-tooltip="Ключевой персонаж"
              onClick={() => handleTabChange('characters')}
            >
              <Users size={24} className="text-amber-500" />
            </div>
            <div 
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer tooltip" 
              data-tooltip="Активное задание"
              onClick={() => handleTabChange('quests')}
            >
              <Star size={24} className="text-purple-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Стрелка вверх для мобильной версии (когда пользователь прокрутил вниз) */}
      {/* Это будет показываться только когда пользователь прокрутил вниз */}
      <motion.button 
        className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-40 lg:hidden"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp size={24} className="text-gray-600 dark:text-gray-300" />
      </motion.button>
    </>
  );
};

export default GameHUD; 