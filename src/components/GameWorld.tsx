import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  BookOpen, 
  Package, 
  ArrowLeft, 
  ArrowRight,
  MessageCircle,
  Search,
  Star
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const GameWorld: React.FC = () => {
  const { 
    player, 
    currentWorld, 
    visitLocation, 
    startDialogue, 
    setGameMode,
    selectWorld 
  } = useGameStore();

  const [selectedTab, setSelectedTab] = useState<'locations' | 'characters' | 'quests'>('locations');

  if (!currentWorld) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Мир не загружен</p>
          <button
            onClick={() => selectWorld('fantasy')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Вернуться к выбору мира
          </button>
        </div>
      </div>
    );
  }

  const currentLocation = currentWorld.locations.find(loc => loc.id === player.currentLocation);
  const availableLocations = currentWorld.locations.filter(loc => 
    loc.id === player.currentLocation || 
    currentLocation?.connections.includes(loc.id)
  );

  const charactersInLocation = currentWorld.characters.filter(char =>
    currentLocation?.characters.includes(char.id)
  );

  const activeQuests = currentWorld.quests.filter(quest =>
    player.activeQuests.includes(quest.id)
  );

  const handleLocationClick = (locationId: string) => {
    visitLocation(locationId);
  };

  const handleCharacterClick = (characterId: string) => {
    const character = currentWorld.characters.find(char => char.id === characterId);
    if (character && character.dialogues.length > 0) {
      startDialogue(characterId, character.dialogues[0].id);
    }
  };

  const handleQuestClick = (questId: string) => {
    // Переходим к экрану квестов
    setGameMode('quest');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок мира */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentWorld.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {currentWorld.description}
              </p>
            </div>
            <button
              onClick={() => selectWorld('')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </motion.div>

        {/* Текущая локация */}
        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 mb-4 text-white shadow-lg"
          >
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold">Текущая локация</h2>
            </div>
            <h3 className="text-xl font-bold mb-2">{currentLocation.name}</h3>
            <p className="text-blue-100">{currentLocation.description}</p>
          </motion.div>
        )}

        {/* Навигационные вкладки */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 mb-4 shadow-lg">
          {[
            { id: 'locations', label: 'Локации', icon: MapPin },
            { id: 'characters', label: 'Персонажи', icon: Users },
            { id: 'quests', label: 'Квесты', icon: BookOpen }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`
                flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all
                ${selectedTab === id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Контент вкладок */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === 'locations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer
                      border-2 transition-all duration-200
                      ${location.id === player.currentLocation
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    onClick={() => handleLocationClick(location.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {location.name}
                      </h3>
                      {player.visitedLocations.includes(location.id) && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {location.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{location.characters.length} персонажей</span>
                      <Package className="w-3 h-3 ml-3 mr-1" />
                      <span>{location.items.length} предметов</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {charactersInLocation.map((character, index) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    onClick={() => handleCharacterClick(character.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {character.name}
                      </h3>
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {character.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {character.personality}
                      </span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${character.trustLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {character.trustLevel}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'quests' && (
              <div className="space-y-4">
                {activeQuests.length > 0 ? (
                  activeQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => handleQuestClick(quest.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {quest.name}
                        </h3>
                        <BookOpen className="w-4 h-4 text-orange-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {quest.description}
                      </p>
                      <div className="space-y-2">
                        {quest.objectives.map((objective) => (
                          <div
                            key={objective.id}
                            className={`flex items-center text-sm ${
                              objective.isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              objective.isCompleted
                                ? 'bg-green-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            {objective.description}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Нет активных квестов</p>
                    <p className="text-sm">Поговорите с персонажами, чтобы получить квесты</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Нижняя панель действий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
        >
          <div className="flex justify-around">
            <button
              onClick={() => setGameMode('inventory')}
              className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Package className="w-6 h-6 mb-1" />
              <span className="text-xs">Инвентарь</span>
            </button>
            <button
              onClick={() => setGameMode('quest')}
              className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              <BookOpen className="w-6 h-6 mb-1" />
              <span className="text-xs">Квесты</span>
            </button>
            <button
              onClick={() => setGameMode('exploration')}
              className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
            >
              <Search className="w-6 h-6 mb-1" />
              <span className="text-xs">Исследовать</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameWorld; 