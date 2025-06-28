import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, PlayerState, World, Dialogue, Quest, Item, Character, Location, TutorialState } from '@/types';
import { allWorlds, getWorldById, WorldId } from '@/data/worlds';

interface GameStore extends AppState {
  // Actions
  initializePlayer: (telegramUser: any) => void;
  selectWorld: (worldId: WorldId) => void;
  visitLocation: (locationId: string) => void;
  startDialogue: (characterId: string, dialogueId: string) => void;
  selectDialogueOption: (optionId: string) => void;
  startQuest: (questId: string) => void;
  completeQuestObjective: (questId: string, objectiveId: string) => void;
  addItemToInventory: (item: Item, quantity?: number) => void;
  removeItemFromInventory: (itemId: string, quantity?: number) => void;
  updateCharacterTrust: (characterId: string, change: number) => void;
  setGameMode: (mode: AppState['gameMode']) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => void;
  // Новые действия для обучения
  startTutorial: () => void;
  nextTutorialStep: () => void;
  completeTutorialStep: (stepId: string) => void;
  dismissTutorial: (forever?: boolean) => void;
  setGameDifficulty: (difficulty: AppState['gameDifficulty']) => void;
}

const initialPlayerState: PlayerState = {
  id: '',
  name: '',
  currentWorld: 'fantasy',
  currentLocation: '',
  inventory: [],
  completedQuests: [],
  activeQuests: [],
  visitedLocations: [],
  characterTrust: {},
  storyProgress: {},
  achievements: []
};

const initialTutorialState: TutorialState = {
  isActive: false,
  currentStep: 0,
  completedSteps: [],
  dismissedForever: false
};

const initialAppState: AppState = {
  player: initialPlayerState,
  currentWorld: null,
  currentDialogue: null,
  isLoading: false,
  error: null,
  gameMode: 'exploration',
  tutorialState: initialTutorialState,
  gameDifficulty: 'medium'
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialAppState,

      // Экспортируем миры для доступа из компонентов
      allWorlds,

      initializePlayer: (telegramUser) => {
        console.log('[DEBUG] initializePlayer вызван с:', telegramUser);
        const worldId: WorldId = 'fantasy';
        const player: PlayerState = {
          ...initialPlayerState,
          id: telegramUser.id.toString(),
          name: telegramUser.first_name || 'Путник',
          currentWorld: worldId,
          currentLocation: 'fantasy-village'
        };

        const world = getWorldById(worldId);
        console.log('[DEBUG] Получен мир:', world ? world.id : 'не найден');

        // Проверяем, нужно ли запустить обучение
        const shouldStartTutorial = !get().tutorialState?.dismissedForever;

        set({
          player,
          currentWorld: world,
          isLoading: false,
          tutorialState: {
            ...initialTutorialState,
            isActive: shouldStartTutorial
          }
        });
        
        // Если это первый запуск, автоматически запускаем обучение
        if (shouldStartTutorial) {
          setTimeout(() => get().startTutorial(), 1000);
        }
        
        console.log('[DEBUG] Состояние после initializePlayer:', {
          player,
          currentWorld: world,
          isLoading: false
        });
      },

      selectWorld: (worldId: WorldId) => {
        console.log('[DEBUG] selectWorld вызван с id:', worldId);
        
        // Проверка на пустой id
        if (!worldId) {
          console.error('[DEBUG] Попытка выбрать мир с пустым id');
          return;
        }
        
        const world = getWorldById(worldId);
        if (!world) {
          console.error(`[DEBUG] Мир с id "${worldId}" не найден в getWorldById`);
          set({ error: `Мир "${worldId}" не найден` });
          return;
        }

        console.log('[DEBUG] Мир найден:', world.id, world.name);
        const { player } = get();
        const updatedPlayer = {
          ...player,
          currentWorld: worldId,
          currentLocation: world.locations[0]?.id || ''
        };

        console.log('[DEBUG] Обновление состояния игрока:', {
          currentWorld: worldId,
          currentLocation: world.locations[0]?.id || ''
        });
        
        set({
          player: updatedPlayer,
          currentWorld: world,
          currentDialogue: null,
          gameMode: 'exploration'
        });
        
        console.log('[DEBUG] Состояние обновлено, currentWorld:', world.id);
      },

      visitLocation: (locationId) => {
        const { player, currentWorld } = get();
        if (!currentWorld) return;

        const location = currentWorld.locations.find(loc => loc.id === locationId);
        if (!location) return;

        const updatedPlayer = {
          ...player,
          currentLocation: locationId,
          visitedLocations: player.visitedLocations.includes(locationId)
            ? player.visitedLocations
            : [...player.visitedLocations, locationId]
        };

        set({
          player: updatedPlayer,
          gameMode: 'exploration'
        });
      },

      startDialogue: (characterId, dialogueId) => {
        const { currentWorld } = get();
        if (!currentWorld) return;

        const character = currentWorld.characters.find(char => char.id === characterId);
        if (!character) return;

        const dialogue = character.dialogues.find(dial => dial.id === dialogueId);
        if (!dialogue) return;

        set({
          currentDialogue: dialogue,
          gameMode: 'dialogue'
        });
      },

      selectDialogueOption: (optionId) => {
        const { currentDialogue, player, currentWorld } = get();
        if (!currentDialogue || !currentWorld) return;

        const option = currentDialogue.options.find(opt => opt.id === optionId);
        if (!option) return;

        // Применяем последствия выбора
        let updatedPlayer = { ...player };

        option.consequences.forEach(consequence => {
          switch (consequence.type) {
            case 'quest_progress':
              // Обновляем прогресс квеста
              const quest = currentWorld.quests.find(q => q.id === consequence.target);
              if (quest) {
                const updatedQuests = currentWorld.quests.map(q =>
                  q.id === quest.id
                    ? { ...q, isActive: true }
                    : q
                );
                set({ currentWorld: { ...currentWorld, quests: updatedQuests } });
              }
              break;

            case 'item_gain':
              // Добавляем предмет в инвентарь
              const item = currentWorld.locations
                .flatMap(loc => loc.items)
                .find(i => i.id === consequence.target);
              if (item) {
                get().addItemToInventory(item, consequence.value);
              }
              break;

            case 'trust_change':
              // Изменяем доверие к персонажу
              get().updateCharacterTrust(consequence.target, consequence.value);
              break;

            case 'location_unlock':
              // Разблокируем новую локацию
              const location = currentWorld.locations.find(loc => loc.id === consequence.target);
              if (location) {
                const updatedLocations = currentWorld.locations.map(loc =>
                  loc.id === location.id
                    ? { ...loc, isVisited: false }
                    : loc
                );
                set({ currentWorld: { ...currentWorld, locations: updatedLocations } });
              }
              break;

            case 'story_progress':
              // Обновляем прогресс истории
              updatedPlayer = {
                ...updatedPlayer,
                storyProgress: {
                  ...updatedPlayer.storyProgress,
                  [consequence.target]: (updatedPlayer.storyProgress[consequence.target] || 0) + consequence.value
                }
              };
              break;
          }
        });

        set({ player: updatedPlayer });

        // Переходим к следующему диалогу или возвращаемся к исследованию
        if (option.nextDialogueId) {
          const nextDialogue = currentWorld.characters
            .flatMap(char => char.dialogues)
            .find(dial => dial.id === option.nextDialogueId);
          if (nextDialogue) {
            set({ currentDialogue: nextDialogue });
          }
        } else {
          set({
            currentDialogue: null,
            gameMode: 'exploration'
          });
        }
      },

      startQuest: (questId) => {
        const { player, currentWorld } = get();
        if (!currentWorld) return;

        const quest = currentWorld.quests.find(q => q.id === questId);
        if (!quest) return;

        const updatedPlayer = {
          ...player,
          activeQuests: player.activeQuests.includes(questId)
            ? player.activeQuests
            : [...player.activeQuests, questId]
        };

        const updatedQuests = currentWorld.quests.map(q =>
          q.id === questId
            ? { ...q, isActive: true }
            : q
        );

        set({
          player: updatedPlayer,
          currentWorld: { ...currentWorld, quests: updatedQuests }
        });
      },

      completeQuestObjective: (questId, objectiveId) => {
        const { currentWorld } = get();
        if (!currentWorld) return;

        const updatedQuests = currentWorld.quests.map(quest => {
          if (quest.id === questId) {
            const updatedObjectives = quest.objectives.map(obj =>
              obj.id === objectiveId
                ? { ...obj, isCompleted: true }
                : obj
            );

            // Проверяем, завершен ли весь квест
            const isCompleted = updatedObjectives.every(obj => obj.isCompleted);
            if (isCompleted) {
              // Выдаем награды
              quest.rewards.forEach(reward => {
                switch (reward.type) {
                  case 'item':
                    const item = currentWorld.locations
                      .flatMap(loc => loc.items)
                      .find(i => i.id === reward.target);
                    if (item) {
                      get().addItemToInventory(item, reward.value);
                    }
                    break;
                  case 'trust':
                    get().updateCharacterTrust(quest.giverId, reward.value);
                    break;
                  case 'location_unlock':
                    const location = currentWorld.locations.find(loc => loc.id === reward.target);
                    if (location) {
                      const updatedLocations = currentWorld.locations.map(loc =>
                        loc.id === location.id
                          ? { ...loc, isVisited: false }
                          : loc
                      );
                      set({ currentWorld: { ...currentWorld, locations: updatedLocations } });
                    }
                    break;
                }
              });

              // Добавляем квест в завершенные
              const { player } = get();
              const updatedPlayer = {
                ...player,
                completedQuests: [...player.completedQuests, questId],
                activeQuests: player.activeQuests.filter(id => id !== questId)
              };
              set({ player: updatedPlayer });
            }

            return {
              ...quest,
              objectives: updatedObjectives,
              isCompleted
            };
          }
          return quest;
        });

        set({ currentWorld: { ...currentWorld, quests: updatedQuests } });
      },

      addItemToInventory: (item, quantity = 1) => {
        const { player } = get();
        const existingItem = player.inventory.find(invItem => invItem.itemId === item.id);

        let updatedInventory;
        if (existingItem) {
          updatedInventory = player.inventory.map(invItem =>
            invItem.itemId === item.id
              ? { ...invItem, quantity: invItem.quantity + quantity }
              : invItem
          );
        } else {
          updatedInventory = [
            ...player.inventory,
            {
              itemId: item.id,
              quantity,
              acquiredAt: new Date()
            }
          ];
        }

        set({
          player: {
            ...player,
            inventory: updatedInventory
          }
        });
      },

      removeItemFromInventory: (itemId, quantity = 1) => {
        const { player } = get();
        const existingItem = player.inventory.find(invItem => invItem.itemId === itemId);

        if (!existingItem) return;

        let updatedInventory;
        if (existingItem.quantity <= quantity) {
          updatedInventory = player.inventory.filter(invItem => invItem.itemId !== itemId);
        } else {
          updatedInventory = player.inventory.map(invItem =>
            invItem.itemId === itemId
              ? { ...invItem, quantity: invItem.quantity - quantity }
              : invItem
          );
        }

        set({
          player: {
            ...player,
            inventory: updatedInventory
          }
        });
      },

      updateCharacterTrust: (characterId, change) => {
        const { player } = get();
        const currentTrust = player.characterTrust[characterId] || 0;
        const newTrust = Math.max(0, Math.min(100, currentTrust + change));

        set({
          player: {
            ...player,
            characterTrust: {
              ...player.characterTrust,
              [characterId]: newTrust
            }
          }
        });
      },

      setGameMode: (mode) => {
        // Если активно обучение, не переключаем режим (кроме явного переключения в режим tutorial)
        if (get().tutorialState?.isActive && mode !== 'tutorial') {
          console.log('[DEBUG] Переключение режима заблокировано во время обучения');
          return;
        }
        console.log('[DEBUG] Установка режима игры:', mode);
        set({ gameMode: mode });
      },

      resetGame: () => {
        set(initialAppState);
      },

      saveGame: () => {
        // Сохранение происходит автоматически через persist middleware
      },

      loadGame: () => {
        // Загрузка происходит автоматически через persist middleware
      },

      // Методы для системы обучения
      startTutorial: () => {
        console.log('[DEBUG] Запуск обучения');
        set({
          tutorialState: {
            isActive: true,
            currentStep: 0,
            completedSteps: [],
            dismissedForever: false
          },
          gameMode: 'tutorial'
        });
      },

      nextTutorialStep: () => {
        const { tutorialState } = get();
        if (!tutorialState) return;

        const nextStep = tutorialState.currentStep + 1;
        console.log('[DEBUG] Переход к шагу обучения:', nextStep);
        
        set({
          tutorialState: {
            ...tutorialState,
            currentStep: nextStep
          }
        });
      },

      completeTutorialStep: (stepId) => {
        const { tutorialState } = get();
        if (!tutorialState) return;

        console.log('[DEBUG] Завершен шаг обучения:', stepId);
        set({
          tutorialState: {
            ...tutorialState,
            completedSteps: [...tutorialState.completedSteps, stepId]
          }
        });
      },

      dismissTutorial: (forever = false) => {
        console.log('[DEBUG] Закрытие обучения, навсегда:', forever);
        set({
          tutorialState: {
            ...initialTutorialState,
            dismissedForever: forever
          },
          gameMode: 'exploration'
        });
      },

      setGameDifficulty: (difficulty) => {
        console.log('[DEBUG] Установка сложности игры:', difficulty);
        set({ gameDifficulty: difficulty });
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        player: state.player,
        gameDifficulty: state.gameDifficulty,
        tutorialState: {
          ...state.tutorialState,
          isActive: false // Всегда отключаем активное состояние при сохранении
        }
      })
    }
  )
); 