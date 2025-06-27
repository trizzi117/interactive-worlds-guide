import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Star,
  Award,
  Users,
  MapPin,
  Package,
  Target
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const QuestScreen: React.FC = () => {
  const { 
    player, 
    currentWorld, 
    startQuest, 
    completeQuestObjective, 
    setGameMode 
  } = useGameStore();
  
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'available'>('active');

  const handleBack = () => {
    setGameMode('exploration');
  };

  const handleStartQuest = (questId: string) => {
    startQuest(questId);
  };

  const handleCompleteObjective = (questId: string, objectiveId: string) => {
    completeQuestObjective(questId, objectiveId);
  };

  // Разделяем квесты по статусу
  const activeQuests = currentWorld?.quests.filter(quest =>
    player.activeQuests.includes(quest.id)
  ) || [];

  const completedQuests = currentWorld?.quests.filter(quest =>
    player.completedQuests.includes(quest.id)
  ) || [];

  const availableQuests = currentWorld?.quests.filter(quest =>
    !player.activeQuests.includes(quest.id) && 
    !player.completedQuests.includes(quest.id)
  ) || [];

  const getQuestGiver = (questId: string) => {
    return currentWorld?.characters.find(char => char.quests.includes(questId));
  };

  const getObjectiveIcon = (type: string) => {
    switch (type) {
      case 'collect_item':
        return Package;
      case 'talk_to_character':
        return Users;
      case 'visit_location':
        return MapPin;
      case 'solve_puzzle':
        return Target;
      default:
        return Circle;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'item':
        return Package;
      case 'experience':
        return Star;
      case 'trust':
        return Users;
      case 'location_unlock':
        return MapPin;
      default:
        return Award;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'item':
        return 'text-blue-600 dark:text-blue-400';
      case 'experience':
        return 'text-green-600 dark:text-green-400';
      case 'trust':
        return 'text-purple-600 dark:text-purple-400';
      case 'location_unlock':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Квесты
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeQuests.length} активных, {completedQuests.length} завершенных
                </p>
              </div>
            </div>
            <BookOpen className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        {/* Навигационные вкладки */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 mb-4 shadow-lg">
          {[
            { id: 'active', label: 'Активные', count: activeQuests.length },
            { id: 'available', label: 'Доступные', count: availableQuests.length },
            { id: 'completed', label: 'Завершенные', count: completedQuests.length }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`
                flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all
                ${selectedTab === id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-sm font-medium mr-2">{label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedTab === id
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {count}
              </span>
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
            {selectedTab === 'active' && (
              <div className="space-y-4">
                {activeQuests.length > 0 ? (
                  activeQuests.map((quest, index) => {
                    const giver = getQuestGiver(quest.id);
                    const completedObjectives = quest.objectives.filter(obj => obj.isCompleted).length;
                    const progress = (completedObjectives / quest.objectives.length) * 100;

                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                              {quest.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {quest.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {completedObjectives}/{quest.objectives.length}
                            </div>
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                              <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {giver && (
                          <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-1" />
                            <span>От: {giver.name}</span>
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          {quest.objectives.map((objective) => {
                            const Icon = getObjectiveIcon(objective.type);
                            return (
                              <div
                                key={objective.id}
                                className={`flex items-center p-2 rounded ${
                                  objective.isCompleted
                                    ? 'bg-green-50 dark:bg-green-900/20'
                                    : 'bg-gray-50 dark:bg-gray-700'
                                }`}
                              >
                                {objective.isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <Icon className="w-4 h-4 text-gray-400 mr-2" />
                                )}
                                <span className={`text-sm ${
                                  objective.isCompleted
                                    ? 'text-green-600 dark:text-green-400 line-through'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {objective.description}
                                </span>
                                {!objective.isCompleted && (
                                  <button
                                    onClick={() => handleCompleteObjective(quest.id, objective.id)}
                                    className="ml-auto px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                                  >
                                    Выполнить
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Награды */}
                        {quest.rewards.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Награды:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {quest.rewards.map((reward, rewardIndex) => {
                                const Icon = getRewardIcon(reward.type);
                                const color = getRewardColor(reward.type);
                                return (
                                  <div key={rewardIndex} className={`flex items-center text-xs ${color}`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    <span>{reward.target} (+{reward.value})</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Нет активных квестов
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Поговорите с персонажами, чтобы получить квесты
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {selectedTab === 'available' && (
              <div className="space-y-4">
                {availableQuests.length > 0 ? (
                  availableQuests.map((quest, index) => {
                    const giver = getQuestGiver(quest.id);
                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                              {quest.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {quest.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleStartQuest(quest.id)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Начать
                          </button>
                        </div>

                        {giver && (
                          <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-1" />
                            <span>От: {giver.name}</span>
                          </div>
                        )}

                        {/* Награды */}
                        {quest.rewards.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Награды:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {quest.rewards.map((reward, rewardIndex) => {
                                const Icon = getRewardIcon(reward.type);
                                const color = getRewardColor(reward.type);
                                return (
                                  <div key={rewardIndex} className={`flex items-center text-xs ${color}`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    <span>{reward.target} (+{reward.value})</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Нет доступных квестов
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Исследуйте мир, чтобы найти новые квесты
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {selectedTab === 'completed' && (
              <div className="space-y-4">
                {completedQuests.length > 0 ? (
                  completedQuests.map((quest, index) => {
                    const giver = getQuestGiver(quest.id);
                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-2 border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {quest.name}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {quest.description}
                            </p>
                          </div>
                          <div className="text-green-500">
                            <Star className="w-6 h-6" />
                          </div>
                        </div>

                        {giver && (
                          <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-1" />
                            <span>От: {giver.name}</span>
                          </div>
                        )}

                        {/* Завершенные цели */}
                        <div className="space-y-1 mb-4">
                          {quest.objectives.map((objective) => (
                            <div key={objective.id} className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="line-through">{objective.description}</span>
                            </div>
                          ))}
                        </div>

                        {/* Полученные награды */}
                        {quest.rewards.length > 0 && (
                          <div className="border-t border-green-200 dark:border-green-800 pt-3">
                            <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                              Полученные награды:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {quest.rewards.map((reward, rewardIndex) => {
                                const Icon = getRewardIcon(reward.type);
                                const color = getRewardColor(reward.type);
                                return (
                                  <div key={rewardIndex} className={`flex items-center text-xs ${color}`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    <span>{reward.target} (+{reward.value})</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Нет завершенных квестов
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Выполните квесты, чтобы увидеть их здесь
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestScreen; 