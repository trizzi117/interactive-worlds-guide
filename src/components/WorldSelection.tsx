import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Rocket, Castle, Pyramid, ArrowRight, User } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { allWorlds } from '@/data/worlds';

const WorldSelection: React.FC = () => {
  const { player, selectWorld } = useGameStore();

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

  const handleWorldSelect = (worldId: string) => {
    // Проверяем, что id не пустой и существует в списке доступных миров
    if (worldId && allWorlds.some(world => world.id === worldId)) {
      console.log('[DEBUG] Выбран мир:', worldId);
      selectWorld(worldId as any);
    } else {
      console.error(`[DEBUG] Попытка выбрать недопустимый мир с id "${worldId}"`);
      // Выбираем первый доступный мир как запасной вариант
      if (allWorlds.length > 0) {
        const defaultWorldId = allWorlds[0].id;
        console.log('[DEBUG] Используем мир по умолчанию:', defaultWorldId);
        selectWorld(defaultWorldId as any);
      }
    }
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Добро пожаловать, {player.name}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Выберите мир для своего приключения
          </p>
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

        {/* Сетка миров */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allWorlds.map((world, index) => {
            const Icon = worldIcons[world.genre as keyof typeof worldIcons];
            const colorClass = worldColors[world.genre as keyof typeof worldColors];

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                onClick={() => handleWorldSelect(world.id)}
              >
                <div className={`
                  bg-gradient-to-br ${colorClass} 
                  rounded-xl p-6 text-white shadow-lg
                  transform transition-all duration-300
                  group-hover:shadow-xl group-hover:-translate-y-1
                `}>
                  {/* Иконка мира */}
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Название мира */}
                  <h3 className="text-xl font-bold mb-2">
                    {world.name}
                  </h3>

                  {/* Описание */}
                  <p className="text-sm opacity-90 mb-4 line-clamp-3">
                    {world.description}
                  </p>

                  {/* Статистика */}
                  <div className="flex justify-between text-sm opacity-75">
                    <span>Локаций: {world.locations.length}</span>
                    <span>Персонажей: {world.characters.length}</span>
                    <span>Квестов: {world.quests.length}</span>
                  </div>

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

        {/* Подсказка */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Нажмите на мир, чтобы начать приключение</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorldSelection; 