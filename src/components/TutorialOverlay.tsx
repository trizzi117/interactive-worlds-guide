import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowDown, Settings, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { TutorialStep } from '@/types';

// Определение шагов обучения
const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Добро пожаловать!',
    content: 'Добро пожаловать в игру! Это краткое обучение познакомит вас с основными механиками игры.',
    position: 'bottom',
    nextStepTrigger: 'click'
  },
  {
    id: 'world-selection',
    title: 'Выбор мира',
    content: 'Нажмите на один из доступных миров, чтобы начать приключение. Каждый мир имеет свою уникальную историю и персонажей.',
    targetElement: '.grid-cols-1',
    position: 'bottom',
    action: 'click',
    nextStepTrigger: 'action'
  },
  {
    id: 'location-navigation',
    title: 'Навигация',
    content: 'Используйте вкладки для переключения между локациями, персонажами и квестами. Нажмите на локацию, чтобы отправиться туда.',
    targetElement: '.flex.bg-white',
    position: 'top',
    action: 'click',
    nextStepTrigger: 'click'
  },
  {
    id: 'character-interaction',
    title: 'Взаимодействие с персонажами',
    content: 'Нажмите на персонажа, чтобы начать диалог с ним. Персонажи могут давать квесты, предметы и важную информацию.',
    targetElement: '[data-tutorial="characters"]',
    position: 'bottom',
    action: 'click',
    nextStepTrigger: 'click'
  },
  {
    id: 'quests',
    title: 'Квесты',
    content: 'Здесь отображаются ваши активные задания. Выполняйте их, чтобы получать награды и продвигаться по сюжету.',
    targetElement: '[data-tutorial="quests"]',
    position: 'right',
    action: 'click',
    nextStepTrigger: 'click'
  },
  {
    id: 'inventory',
    title: 'Инвентарь',
    content: 'В инвентаре хранятся ваши предметы. Некоторые из них можно использовать для выполнения квестов или в диалогах.',
    position: 'left',
    nextStepTrigger: 'click'
  },
  {
    id: 'difficulty',
    title: 'Настройка сложности',
    content: 'Вы можете изменить сложность игры в настройках. На более высокой сложности вы будете получать меньше подсказок.',
    position: 'bottom',
    nextStepTrigger: 'click'
  },
  {
    id: 'completion',
    title: 'Готово!',
    content: 'Теперь вы знаете основы игры. Исследуйте мир, общайтесь с персонажами и выполняйте квесты. Удачи в приключениях!',
    position: 'bottom',
    nextStepTrigger: 'click'
  }
];

const TutorialOverlay: React.FC = () => {
  const { tutorialState, dismissTutorial, nextTutorialStep, completeTutorialStep, gameDifficulty, setGameMode } = useGameStore();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Получаем текущий шаг обучения
  const currentStep = tutorialSteps[tutorialState?.currentStep || 0];
  
  // Эффект для позиционирования подсказки относительно целевого элемента
  useEffect(() => {
    if (!currentStep?.targetElement) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(currentStep.targetElement) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Получаем размеры и позицию элемента
      const rect = element.getBoundingClientRect();
      let newPosition = { top: 0, left: 0 };
      
      // Позиционируем подсказку относительно элемента
      switch (currentStep.position) {
        case 'top':
          newPosition = {
            top: rect.top - 130,
            left: rect.left + rect.width / 2 - 150
          };
          break;
        case 'bottom':
          newPosition = {
            top: rect.bottom + 20,
            left: rect.left + rect.width / 2 - 150
          };
          break;
        case 'left':
          newPosition = {
            top: rect.top + rect.height / 2 - 80,
            left: rect.left - 320
          };
          break;
        case 'right':
          newPosition = {
            top: rect.top + rect.height / 2 - 80,
            left: rect.right + 20
          };
          break;
        default:
          newPosition = {
            top: rect.bottom + 20,
            left: rect.left + rect.width / 2 - 150
          };
      }
      
      setPosition(newPosition);
      
      // Добавляем класс подсветки к целевому элементу
      element.classList.add('tutorial-highlight');
      
      return () => {
        element.classList.remove('tutorial-highlight');
      };
    }
  }, [currentStep]);

  // Обработчик нажатия кнопки "Далее"
  const handleNext = () => {
    if (!currentStep) return;
    
    completeTutorialStep(currentStep.id);
    
    // Если это последний шаг, закрываем обучение
    if (tutorialState?.currentStep === tutorialSteps.length - 1) {
      dismissTutorial();
      setGameMode('exploration');
      return;
    }
    
    nextTutorialStep();
  };

  // Если обучение не активно, ничего не рендерим
  if (!tutorialState?.isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Затемнение фона */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Основная подсказка */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep?.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute pointer-events-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-[300px]"
          style={{
            top: position.top,
            left: position.left,
            zIndex: 100
          }}
        >
          {/* Заголовок с кнопкой закрытия */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 dark:text-white">
              {currentStep?.title}
            </h3>
            <button
              onClick={() => dismissTutorial()}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Содержимое */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {currentStep?.content}
          </p>
          
          {/* Кнопки */}
          <div className="flex justify-between">
            <button
              onClick={() => dismissTutorial(true)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Пропустить обучение
            </button>
            
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              {tutorialState?.currentStep === tutorialSteps.length - 1 ? 'Завершить' : 'Далее'}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
          
          {/* Индикатор прогресса */}
          <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full"
              style={{ width: `${((tutorialState?.currentStep || 0) + 1) / tutorialSteps.length * 100}%` }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Стрелка-указатель */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ y: { repeat: Infinity, duration: 1.5 } }}
          className="absolute z-50 text-blue-500"
          style={{
            top: currentStep?.position === 'top' ? position.top - 30 : position.top + 130,
            left: position.left + 150,
          }}
        >
          <ArrowDown size={32} strokeWidth={3} />
        </motion.div>
      )}
      
      {/* Плавающая кнопка помощи */}
      <div className="fixed bottom-5 right-5 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            dismissTutorial();
            setTimeout(() => {
              dismissTutorial(false);
              nextTutorialStep();
            }, 300);
          }}
          className="bg-blue-500 p-3 rounded-full shadow-lg text-white"
        >
          <HelpCircle size={24} />
        </motion.button>
      </div>

      {/* Плавающая кнопка настроек */}
      <div className="fixed bottom-5 left-5 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gray-700 dark:bg-gray-600 p-3 rounded-full shadow-lg text-white"
        >
          <Settings size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default TutorialOverlay; 