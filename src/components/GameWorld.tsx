import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  BookOpen, 
  Package, 
  MessageCircle,
  Search,
  Star,
  HelpCircle,
  Settings,
  Home,
  Menu,
  Bell,
  Info,
  Compass,
  Sparkles,
  Sword,
  Rocket,
  Castle,
  Pyramid,
  Globe,
  Gift,
  X,
  ChevronRight
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import SettingsModal from './SettingsModal';
import ObjectivesPanel from './ObjectivesPanel';
import AchievementNotification from './AchievementNotification';
import GameHUD from './GameHUD';

const GameWorld: React.FC = () => {
  const { 
    player, 
    currentWorld, 
    visitLocation, 
    startDialogue, 
    setGameMode,
    selectWorld,
    allWorlds,
    startTutorial,
    gameDifficulty
  } = useGameStore();

  const [selectedTab, setSelectedTab] = useState<'locations' | 'characters' | 'quests'>('locations');
  const [showSettings, setShowSettings] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [showTips, setShowTips] = useState<string | null>(null);
  const [showNewUserGuide, setShowNewUserGuide] = useState(true);

  // Функция для показа подсказок в зависимости от уровня сложности
  const shouldShowHint = (type: 'basic' | 'detailed') => {
    if (type === 'basic') return gameDifficulty !== 'hard';
    if (type === 'detailed') return gameDifficulty === 'easy';
    return false;
  };
  
  // Эффект для отображения начальной подсказки для новых игроков
  useEffect(() => {
    // Если это первый вход в игру, показываем подсказку
    if (player.visitedLocations.length === 0) {
      const timer = setTimeout(() => {
        setShowTips('welcome');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [player.visitedLocations.length]);

  if (!currentWorld) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Мир не загружен</p>
          <button
            onClick={() => {
              console.log('[DEBUG] Нажата кнопка возврата к выбору мира');
              // Сбрасываем текущий мир, но не передаем пустую строку
              if (allWorlds && allWorlds.length > 0) {
                // Временно выбираем первый мир, чтобы избежать ошибки с пустым id
                const tempWorldId = allWorlds[0].id;
                selectWorld(tempWorldId as any);
                // Затем переходим на страницу выбора мира
                window.location.href = '/';
              } else {
                console.log('[DEBUG] allWorlds не определен или пуст, переходим на главную');
                window.location.href = '/';
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <Home size={18} />
            <span>Вернуться к выбору мира</span>
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
    setShowTips(null); // Скрываем подсказки при переходе в новую локацию
    
    // Симулируем показ достижения при посещении новой локации
    if (!player.visitedLocations.includes(locationId)) {
      const location = currentWorld.locations.find(loc => loc.id === locationId);
      if (location) {
        setTimeout(() => {
          setCurrentAchievement({
            id: `visited-${locationId}`,
            name: `Исследователь: ${location.name}`,
            description: `Вы посетили локацию ${location.name} впервые!`,
            unlockedAt: new Date(),
            iconUrl: '/images/achievement-explorer.png'
          });
        }, 1000);
      }
    }
  };

  const handleCharacterClick = (characterId: string) => {
    const character = currentWorld.characters.find(char => char.id === characterId);
    if (character && character.dialogues.length > 0) {
      startDialogue(characterId, character.dialogues[0].id);
      setShowTips(null); // Скрываем подсказки при начале диалога
    }
  };

  const handleQuestClick = (questId: string) => {
    // Переходим к экрану квестов
    setGameMode('quest');
    setShowTips(null); // Скрываем подсказки при переходе к квестам
  };

  // Обработчик смены вкладки (для GameHUD)
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab as any);
    if (tab === 'characters' && shouldShowHint('basic')) {
      setShowTips('character');
    } else if (tab === 'quests' && shouldShowHint('basic')) {
      setShowTips('quests');
    }
  };

  // Функция для отображения подсказок
  const renderTip = () => {
    if (!showTips) return null;

    let tipContent = {
      title: '',
      content: '',
      icon: Info as any
    };

    switch (showTips) {
      case 'welcome':
        tipContent = {
          title: 'Добро пожаловать!',
          content: 'Это ваша первая локация. Исследуйте доступные места, общайтесь с персонажами и выполняйте квесты, чтобы продвигаться по сюжету.',
          icon: Sparkles
        };
        break;
      case 'character':
        tipContent = {
          title: 'Персонажи',
          content: 'Нажмите на персонажа, чтобы начать диалог. Персонажи могут дать вам квесты или важную информацию.',
          icon: Users
        };
        break;
      case 'quests':
        tipContent = {
          title: 'Квесты',
          content: 'Здесь отображаются ваши активные квесты. Выполняйте задачи, чтобы получить награды и продвинуться по сюжету.',
          icon: BookOpen
        };
        break;
      case 'inventory':
        tipContent = {
          title: 'Инвентарь',
          content: 'В инвентаре хранятся ваши предметы. Некоторые из них могут понадобиться для выполнения квестов.',
          icon: Package
        };
        break;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-24 left-4 right-4 mx-auto max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40"
      >
        <div className="flex">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4">
            <tipContent.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 dark:text-white text-lg mb-1">
              {tipContent.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {tipContent.content}
            </p>
          </div>
          <button
            onClick={() => setShowTips(null)}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              startTutorial();
              setShowTips(null);
            }}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 flex items-center"
          >
            Показать полное обучение
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Компонент для руководства новичка
  const NewUserGuide = () => {
    if (!showNewUserGuide || player.visitedLocations.length > 1) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
      >
        <div className="flex">
          <div className="mr-4 flex-shrink-0">
            <Compass className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Начните своё приключение!
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc pl-5">
              <li><strong>Исследуйте локации</strong> — переходите между доступными местами, чтобы находить новых персонажей</li>
              <li><strong>Общайтесь с персонажами</strong> — начинайте диалоги и получайте квесты</li>
              <li><strong>Выполняйте квесты</strong> — следуйте заданиям для продвижения по сюжету</li>
            </ul>
            <div className="flex justify-end mt-3">
              <button 
                onClick={() => setShowNewUserGuide(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-4"
              >
                Закрыть
              </button>
              <button 
                onClick={() => {
                  startTutorial();
                  setShowNewUserGuide(false);
                }}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Показать обучение
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-4 pb-20 relative">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок мира */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {worldGenreIcon(currentWorld.genre)}
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentWorld.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {currentWorld.description.length > 100 
                    ? `${currentWorld.description.substring(0, 100)}...` 
                    : currentWorld.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                console.log('[DEBUG] Нажата кнопка возврата к выбору мира');
                // Сбрасываем текущий мир, но не передаем пустую строку
                if (allWorlds && allWorlds.length > 0) {
                  // Временно выбираем первый мир, чтобы избежать ошибки с пустым id
                  const tempWorldId = allWorlds[0].id;
                  selectWorld(tempWorldId as any);
                  // Затем переходим на страницу выбора мира
                  window.location.href = '/';
                } else {
                  console.log('[DEBUG] allWorlds не определен или пуст, переходим на главную');
                  window.location.href = '/';
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 tooltip"
              data-tooltip="Вернуться к выбору мира"
            >
              <Home size={20} />
            </button>
          </div>
        </motion.div>

        {/* Руководство для новых пользователей */}
        <NewUserGuide />

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
            { id: 'characters', label: 'Персонажи', icon: MessageCircle, dataAttr: 'characters', tipType: 'character' },
            { id: 'quests', label: 'Квесты', icon: BookOpen, dataAttr: 'quests', tipType: 'quests' }
          ].map(({ id, label, icon: Icon, dataAttr, tipType }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`
                flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all
                ${selectedTab === id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              data-tutorial={dataAttr}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Подсказка для новичков */}
        {shouldShowHint('detailed') && selectedTab === 'locations' && !player.visitedLocations.length && (
          <div className="hint-popup mb-4">
            <h4 className="font-medium text-gray-800 dark:text-white mb-1">
              Подсказка
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Нажмите на локацию, чтобы отправиться туда. Исследуйте мир и находите новых персонажей!
            </p>
          </div>
        )}

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
                      <div className="flex items-center space-x-2">
                        {location.characters.length > 0 && (
                          <div className="flex items-center text-gray-500 tooltip" data-tooltip={`${location.characters.length} персонажей`}>
                            <Users className="w-4 h-4" />
                            <span className="text-xs ml-1">{location.characters.length}</span>
                          </div>
                        )}
                        {player.visitedLocations.includes(location.id) && (
                          <Star className="w-4 h-4 text-yellow-500 tooltip" data-tooltip="Уже посещено" />
                        )}
                        {location.id === player.currentLocation && (
                          <MapPin className="w-4 h-4 text-blue-500 tooltip" data-tooltip="Текущая локация" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {location.id !== player.currentLocation && (
                        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                          Доступно для посещения
                        </span>
                      )}
                      {location.items.length > 0 && (
                        <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                          Предметы: {location.items.length}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {charactersInLocation.length > 0 ? (
                  charactersInLocation.map((character, index) => (
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
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500 tooltip" data-tooltip="Начать диалог" />
                          {character.quests.length > 0 && (
                            <BookOpen className="w-4 h-4 text-amber-500 tooltip" data-tooltip="Есть задания" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {character.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {character.personality}
                        </span>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                            <div
                              className={`h-full rounded-full ${getTrustLevelColor(character.trustLevel)}`}
                              style={{ width: `${character.trustLevel}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Доверие
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
                    <Users size={40} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-gray-600 dark:text-gray-300">
                      В этой локации нет персонажей. Посетите другую локацию, чтобы найти новых персонажей.
                    </p>
                    {shouldShowHint('basic') && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-4 mx-auto max-w-sm">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Подсказка: Перейдите на вкладку "Локации" и выберите другое место для исследования
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'quests' && (
              <div>
                {activeQuests.length > 0 ? (
                  <div className="space-y-4">
                    {activeQuests.map((quest, index) => (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                          <BookOpen className="w-5 h-5 text-amber-500 mr-2" />
                          {quest.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {quest.description}
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700 dark:text-gray-200 text-sm flex items-center">
                            <Compass className="w-4 h-4 mr-2 text-blue-500" />
                            Задачи:
                          </h4>
                          {quest.objectives.map((objective) => (
                            <div 
                              key={objective.id} 
                              className="flex items-start ml-2"
                            >
                              <div className="flex-shrink-0 mt-1 mr-2">
                                {objective.isCompleted ? (
                                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <Star size={8} className="text-white" />
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                                )}
                              </div>
                              <p className={`text-sm ${
                                objective.isCompleted 
                                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {objective.description}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {quest.rewards.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-medium text-gray-700 dark:text-gray-200 text-sm flex items-center mb-2">
                              <Gift className="w-4 h-4 mr-2 text-purple-500" />
                              Награды:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {quest.rewards.map((reward, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                                >
                                  {reward.type === 'item' ? `Предмет: ${reward.target}` : 
                                   reward.type === 'experience' ? `Опыт: ${reward.value}` : 
                                   reward.type === 'trust' ? `Доверие: +${reward.value}` :
                                   'Новая локация'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg"
                  >
                    <BookOpen size={40} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                      У вас пока нет активных заданий
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Поговорите с персонажами, чтобы получить задания и узнать больше об этом мире
                    </p>
                    {shouldShowHint('basic') && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-2 mx-auto max-w-sm">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Подсказка: Перейдите на вкладку "Персонажи" и поговорите с ними, чтобы получить задания
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Панель с текущими целями */}
        <ObjectivesPanel />
        
        {/* Настройки игры */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        
        {/* Уведомления о достижениях */}
        <AchievementNotification 
          achievement={currentAchievement} 
          onClose={() => setCurrentAchievement(null)} 
        />
      </div>
      
      {/* GameHUD - Панель навигации и подсказок */}
      <GameHUD activeTab={selectedTab} onTabChange={handleTabChange} />

      {/* Всплывающие подсказки */}
      <AnimatePresence>
        {showTips && renderTip()}
      </AnimatePresence>
    </div>
  );
};

// Вспомогательные функции
const worldGenreIcon = (genre: string) => {
  switch (genre) {
    case 'fantasy':
      return <Sword className="w-8 h-8 text-green-500" />;
    case 'sci-fi':
      return <Rocket className="w-8 h-8 text-blue-500" />;
    case 'medieval':
      return <Castle className="w-8 h-8 text-amber-500" />;
    case 'egypt':
      return <Pyramid className="w-8 h-8 text-yellow-500" />;
    default:
      return <Globe className="w-8 h-8 text-gray-500" />;
  }
};

const getTrustLevelColor = (trust: number) => {
  if (trust >= 75) return 'bg-green-500';
  if (trust >= 50) return 'bg-blue-500';
  if (trust >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default GameWorld; 