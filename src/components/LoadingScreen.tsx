import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Globe, Sword, Rocket, Castle, Pyramid } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const icons = [Globe, Sword, Rocket, Castle, Pyramid];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Интерактивный Путеводитель
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            По мирам
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.5
              }}
              className="mx-2"
            >
              <Icon 
                size={32} 
                className="text-blue-500 dark:text-blue-400"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center"
        >
          <Loader2 
            size={24} 
            className="text-blue-500 dark:text-blue-400 animate-spin mr-2"
          />
          <span className="text-gray-600 dark:text-gray-300">
            Загрузка миров...
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Подготовка к путешествию</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen; 