import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, 
  Rocket, 
  Castle, 
  Pyramid, 
  ArrowRight, 
  User, 
  MapPin, 
  Users, 
  BookOpen, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { allWorlds } from '@/data/worlds';
import { World } from '@/types';

const WorldSelection: React.FC = () => {
  const { player, selectWorld, startTutorial } = useGameStore();
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  const worldIcons = {
    'fantasy': Sword,
    'sci-fi': Rocket,
    'medieval': Castle,
    'egypt': Pyramid
  };

  const worldColors = {
    'fantasy': 'from-green-500 to-emerald-600',
    'sci-fi': 'from-blue-500 to-cyan-600',
    'medieval': 'from-amber-500 to-orange-600',
    'egypt': 'from-yellow-500 to-orange-500'
  };

  const handleWorldSelect = (world: World) => {
    setSelectedWorld(world);
  };

  const handleWorldConfirm = () => {
    if (selectedWorld) {
      // Проверяем, что id не пустой и существует в списке доступных миров
      if (selectedWorld.id && allWorlds.some(w => w.id === selectedWorld.id)) {
        console.log('[DEBUG] Выбран мир:', selectedWorld.id);
        selectWorld(selectedWorld.id as any);
      } else {
        console.error(`[DEBUG] Попытка выбрать недопустимый мир с id "${selectedWorld.id}"`);
        // Выбираем первый доступный мир как запасной вариант
        if (allWorlds.length > 0) {
          const defaultWorldId = allWorlds[0].id;
          console.log('[DEBUG] Используем мир по умолчанию:', defaultWorldId);
          selectWorld(defaultWorldId as any);
        }
      }
    }
  };

  // Анимация пульсации для выбранной карточки
  const pulseAnimation = {
    boxShadow: [
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    ]
  };

  // Функция для отображения иконок особенностей мира
  const renderWorldFeatures = (world: World) => {
    return (
      <div className="flex space-x-3 mt-3">
        <div className="flex items-center text-xs text-white/80">
          <MapPin size={14} className="mr-1" />
          <span>{world.locations.length} локаций</span>
        </div>
        <div className="flex items-center text-xs text-white/80">
          <Users size={14} className="mr-1" />
          <span>{world.characters.length} персонажей</span>
        </div>
        <div className="flex items-center text-xs text-white/80">
          <BookOpen size={14} className="mr-1" />
          <span>{world.quests.length} квестов</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Заголовок */}
        <div className="text-center mb-6">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Добро пожаловать, {player.name}!
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Выберите мир для своего приключения
          </motion.p>
        </div>

        {/* Информация о игроке */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-500 mr-2" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {player.name}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Исследовано локаций: {player.visitedLocations.length}
            </div>
          </div>
        </motion.div>

        {/* Подсказка (появляется только при первом запуске) */}
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 relative"
            >
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 dark:text-blue-400"
              >
                ✕
              </button>
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                    Как начать игру:
                  </h3>
                  <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 ml-5 list-decimal">
                    <li>Выберите один из доступных миров ниже</li>
                    <li>Ознакомьтесь с описанием и особенностями мира</li>
                    <li>Нажмите кнопку "Начать приключение", чтобы войти в выбранный мир</li>
                  </ol>
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => {
                        startTutorial();
                        setShowHelp(false);
                      }}
                      className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 flex items-center"
                    >
                      Показать полное обучение
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Сетка миров */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allWorlds.map((world, index) => {
            const Icon = worldIcons[world.genre as keyof typeof worldIcons];
            const colorClass = worldColors[world.genre as keyof typeof worldColors];
            const isSelected = selectedWorld?.id === world.id;

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={isSelected ? pulseAnimation : {}}
                className={`
                  relative group cursor-pointer
                  ${isSelected ? 'ring-4 ring-blue-400 dark:ring-blue-600 rounded-xl' : ''}
                `}
                onClick={() => handleWorldSelect(world)}
              >
                <div className={`
                  bg-gradient-to-br ${colorClass} 
                  rounded-xl p-6 text-white shadow-lg
                  transform transition-all duration-300
                  group-hover:shadow-xl group-hover:-translate-y-1
                `}>
                  {/* Иконка мира */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-white/20 rounded-full p-2">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="ml-3">
                        <div className="text-xs uppercase tracking-wider opacity-75">
                          {world.genre === 'sci-fi' ? 'Научная фантастика' : 
                           world.genre === 'fantasy' ? 'Фэнтези' :
                           world.genre === 'medieval' ? 'Средневековье' : 'Древний мир'}
                        </div>
                        <h3 className="text-xl font-bold">
                          {world.name}
                        </h3>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-white/30 rounded-full h-6 w-6 flex items-center justify-center">
                        <div className="bg-white rounded-full h-3 w-3"></div>
                      </div>
                    )}
                  </div>

                  {/* Описание */}
                  <p className="text-sm opacity-90 mb-4 line-clamp-3">
                    {world.description}
                  </p>

                  {/* Особенности мира */}
                  {renderWorldFeatures(world)}

                  {/* Индикатор разблокировки */}
                  {!world.isUnlocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                      <span className="text-white font-medium">Скоро откроется</span>
                    </div>
                  )}
                </div>

                {/* Эффект свечения при наведении */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Кнопка подтверждения выбора */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedWorld ? 1 : 0, y: selectedWorld ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 left-0 right-0 flex justify-center z-10"
        >
          <button
            onClick={handleWorldConfirm}
            disabled={!selectedWorld}
            className={`
              px-8 py-4 rounded-full shadow-lg flex items-center justify-center
              text-lg font-bold transition-all duration-300
              ${selectedWorld
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Начать приключение
            <ArrowRight className="ml-2" size={20} />
          </button>
        </motion.div>

        {/* Подсказка */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>{selectedWorld 
            ? 'Нажмите "Начать приключение", чтобы войти в выбранный мир' 
            : 'Нажмите на мир, чтобы выбрать его для приключения'
          }</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorldSelection; 