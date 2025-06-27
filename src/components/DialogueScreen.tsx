import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User, ArrowLeft, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const DialogueScreen: React.FC = () => {
  const { 
    currentDialogue, 
    currentWorld, 
    player, 
    selectDialogueOption, 
    setGameMode 
  } = useGameStore();

  if (!currentDialogue || !currentWorld) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Диалог не найден</p>
          <button
            onClick={() => setGameMode('exploration')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Вернуться к исследованию
          </button>
        </div>
      </div>
    );
  }

  // Находим персонажа, с которым ведется диалог
  const currentCharacter = currentWorld.characters.find(char =>
    char.dialogues.some(dial => dial.id === currentDialogue.id)
  );

  const handleOptionSelect = (optionId: string) => {
    selectDialogueOption(optionId);
  };

  const handleBack = () => {
    setGameMode('exploration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
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
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Диалог
                </h1>
                {currentCharacter && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    с {currentCharacter.name}
                  </p>
                )}
              </div>
            </div>
            {currentCharacter && (
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${currentCharacter.trustLevel}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentCharacter.trustLevel}%
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Основной контент диалога */}
        <div className="flex-1 flex flex-col">
          {/* Сообщение персонажа */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg flex-1"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                {currentCharacter && (
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white mr-2">
                      {currentCharacter.name}
                    </h3>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentDialogue.text}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Варианты ответов */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {currentDialogue.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option.id)}
                  className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {option.text}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.consequences.length > 0 && (
                        <span>
                          {option.consequences.length} последствий
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Показываем требования, если они есть */}
                  {option.requirements && option.requirements.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Требования:
                      </p>
                      {option.requirements.map((req, reqIndex) => (
                        <p key={reqIndex} className="text-xs text-gray-500 dark:text-gray-400">
                          • {req.type}: {req.target}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Информация о персонаже */}
        {currentCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4 shadow-lg"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              О {currentCharacter.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {currentCharacter.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Характер:</strong> {currentCharacter.personality}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DialogueScreen; 