import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  const [visible, setVisible] = useState(!!achievement);
  
  // Автоматически скрываем уведомление через 5 секунд
  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Даем время для анимации
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);
  
  if (!achievement) return null;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-0 right-0 mx-auto max-w-sm bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg shadow-lg p-4 z-50 text-white"
        >
          <button 
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-300 rounded-full p-2 mr-4">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg">
                Новое достижение!
              </h4>
              <p className="font-medium">
                {achievement.name}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {achievement.description}
              </p>
            </div>
          </div>
          
          {/* Прогресс-бар для красивого отсчета времени */}
          <div className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-white"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification; 