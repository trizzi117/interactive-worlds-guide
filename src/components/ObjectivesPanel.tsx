import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const ObjectivesPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { player, currentWorld } = useGameStore();

  // Если мир не выбран, не отображаем панель целей
  if (!currentWorld) return null;

  // Получаем активные квесты
  const activeQuests = currentWorld.quests.filter(quest => 
    player.activeQuests.includes(quest.id)
  );

  // Если нет активных квестов, показываем подсказку для новичков
  if (activeQuests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-16 left-0 right-0 mx-auto max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-30"
      >
        <div className="text-center">
          <h4 className="font-medium text-gray-800 dark:text-white mb-2">
            Что делать дальше?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Поговорите с персонажами, чтобы получить задания и продвинуться в истории.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-16 left-0 right-0 mx-auto max-w-sm bg-white dark:bg-gray-800 rounded-t-lg shadow-lg z-30"
    >
      <div 
        className="p-3 flex justify-between items-center cursor-pointer border-b border-gray-100 dark:border-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h4 className="font-medium text-gray-800 dark:text-white">
          Текущие цели
        </h4>
        <button className="text-gray-500 dark:text-gray-400">
          {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          {activeQuests.map((quest) => (
            <div key={quest.id} className="mb-4 last:mb-0">
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  {quest.isCompleted ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <Circle size={16} className="text-blue-500" />
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-white text-sm">
                    {quest.name}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {quest.description}
                  </p>
                </div>
              </div>

              <div className="ml-6 space-y-1.5">
                {quest.objectives.map((objective) => (
                  <div 
                    key={objective.id} 
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 mr-2">
                      {objective.isCompleted ? (
                        <CheckCircle size={12} className="text-green-500" />
                      ) : (
                        <Circle size={12} className="text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <p className={`text-xs ${
                      objective.isCompleted 
                        ? 'text-gray-400 dark:text-gray-500 line-through' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {objective.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ObjectivesPanel; 