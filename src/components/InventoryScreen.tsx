import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Filter, 
  Search,
  Sword,
  Shield,
  Droplet,
  Key,
  Gem,
  BookOpen,
  Scroll,
  Crown,
  Star,
  Zap,
  Heart,
  Target,
  Map,
  Compass,
  X,
  Plus,
  Minus,
  Info,
  Trash2
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const InventoryScreen: React.FC = () => {
  const { player, currentWorld, removeItemFromInventory, setGameMode } = useGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleBack = () => {
    setGameMode('exploration');
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemFromInventory(itemId, 1);
  };

  // Получаем полную информацию о предметах
  const inventoryItems = player.inventory.map(invItem => {
    // Ищем предмет в данных мира
    const item = currentWorld?.locations
      .flatMap(loc => loc.items)
      .find(i => i.id === invItem.itemId);
    
    return {
      ...invItem,
      item: item || {
        id: invItem.itemId,
        name: invItem.itemId,
        description: 'Неизвестный предмет',
        type: 'artifact' as const,
        rarity: 'common' as const
      }
    };
  });

  // Фильтруем предметы
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const itemTypeIcons = {
    'weapon': Sword,
    'armor': Shield,
    'consumable': Droplet,
    'key': Key,
    'artifact': Gem
  };

  const rarityColors = {
    'common': 'text-gray-600 dark:text-gray-400',
    'uncommon': 'text-green-600 dark:text-green-400',
    'rare': 'text-blue-600 dark:text-blue-400',
    'epic': 'text-purple-600 dark:text-purple-400',
    'legendary': 'text-orange-600 dark:text-orange-400'
  };

  const rarityBorders = {
    'common': 'border-gray-300 dark:border-gray-600',
    'uncommon': 'border-green-300 dark:border-green-600',
    'rare': 'border-blue-300 dark:border-blue-600',
    'epic': 'border-purple-300 dark:border-purple-600',
    'legendary': 'border-orange-300 dark:border-orange-600'
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
                  Инвентарь
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {inventoryItems.length} предметов
                </p>
              </div>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        {/* Поиск и фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg"
        >
          {/* Поиск */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск предметов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Фильтры по типу */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Все', icon: Package },
              { id: 'weapon', label: 'Оружие', icon: Sword },
              { id: 'armor', label: 'Броня', icon: Shield },
              { id: 'consumable', label: 'Расходники', icon: Droplet },
              { id: 'key', label: 'Ключи', icon: Key },
              { id: 'artifact', label: 'Артефакты', icon: Gem }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilterType(id)}
                className={`
                  flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all
                  ${filterType === id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Список предметов */}
        <AnimatePresence>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => {
                const Icon = itemTypeIcons[item.item.type as keyof typeof itemTypeIcons] || Package;
                const rarityColor = rarityColors[item.item.rarity as keyof typeof rarityColors];
                const rarityBorder = rarityBorders[item.item.rarity as keyof typeof rarityBorders];

                return (
                  <motion.div
                    key={item.itemId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-2 ${rarityBorder}
                      hover:shadow-xl transition-all duration-200
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Icon className={`w-6 h-6 mr-2 ${rarityColor}`} />
                        <div>
                          <h3 className={`font-semibold ${rarityColor}`}>
                            {item.item.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {item.item.type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {item.item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Количество:
                        </span>
                        <span className="ml-1 text-sm font-medium text-gray-800 dark:text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${rarityColor}`}>
                        {item.item.rarity}
                      </span>
                    </div>

                    {/* Эффекты предмета */}
                    {item.item.effects && item.item.effects.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Эффекты:
                        </p>
                        {item.item.effects.map((effect, effectIndex) => (
                          <p key={effectIndex} className="text-xs text-gray-600 dark:text-gray-300">
                            • {effect.type}: +{effect.value}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                Инвентарь пуст
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filterType !== 'all' 
                  ? 'Попробуйте изменить поиск или фильтры'
                  : 'Исследуйте мир, чтобы найти предметы'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Статистика инвентаря */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4 shadow-lg"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Статистика инвентаря
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {inventoryItems.length}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Всего предметов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {inventoryItems.filter(item => item.item.type === 'weapon').length}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Оружие</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {inventoryItems.filter(item => item.item.rarity === 'rare' || item.item.rarity === 'epic' || item.item.rarity === 'legendary').length}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Редкие предметы</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Общее количество</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryScreen; 