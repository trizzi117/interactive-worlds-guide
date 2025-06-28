// Основные типы для игрового мира
export interface World {
  id: string;
  name: string;
  description: string;
  genre: 'fantasy' | 'sci-fi' | 'medieval' | 'egypt';
  imageUrl?: string;
  locations: Location[];
  characters: Character[];
  quests: Quest[];
  isUnlocked: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  connections: string[]; // ID связанных локаций
  characters: string[]; // ID персонажей в локации
  items: Item[];
  isVisited: boolean;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  personality: string;
  dialogues: Dialogue[];
  quests: string[]; // ID квестов персонажа
  isFriendly: boolean;
  trustLevel: number; // 0-100
}

export interface Dialogue {
  id: string;
  text: string;
  options: DialogueOption[];
  conditions?: DialogueCondition[];
}

export interface DialogueOption {
  id: string;
  text: string;
  nextDialogueId?: string;
  consequences: Consequence[];
  requirements?: Requirement[];
}

export interface DialogueCondition {
  type: 'quest_completed' | 'item_owned' | 'trust_level' | 'location_visited';
  value: any;
}

export interface Consequence {
  type: 'quest_progress' | 'item_gain' | 'item_lose' | 'trust_change' | 'location_unlock' | 'story_progress';
  target: string;
  value: any;
}

export interface Requirement {
  type: 'quest_completed' | 'item_owned' | 'trust_level' | 'location_visited';
  target: string;
  value: any;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  rewards: Reward[];
  isCompleted: boolean;
  isActive: boolean;
  giverId: string; // ID персонажа, давшего квест
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'collect_item' | 'talk_to_character' | 'visit_location' | 'solve_puzzle';
  target: string;
  isCompleted: boolean;
}

export interface Reward {
  type: 'item' | 'experience' | 'trust' | 'location_unlock';
  target: string;
  value: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'artifact';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects?: ItemEffect[];
}

export interface ItemEffect {
  type: 'damage' | 'healing' | 'protection' | 'special';
  value: number;
}

export interface Puzzle {
  id: string;
  name: string;
  description: string;
  type: 'riddle' | 'pattern' | 'math' | 'sequence';
  question: string;
  answer: string | string[];
  hints: string[];
  isSolved: boolean;
}

// Состояние игрока
import { WorldId } from '@/data/worlds';

export interface PlayerState {
  id: string;
  name: string;
  currentWorld: WorldId;
  currentLocation: string;
  inventory: PlayerItem[];
  completedQuests: string[];
  activeQuests: string[];
  visitedLocations: string[];
  characterTrust: Record<string, number>;
  storyProgress: Record<string, number>;
  achievements: Achievement[];
}

export interface PlayerItem {
  itemId: string;
  quantity: number;
  acquiredAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  iconUrl?: string;
}

// Состояние приложения
export interface AppState {
  player: PlayerState;
  currentWorld: World | null;
  currentDialogue: Dialogue | null;
  isLoading: boolean;
  error: string | null;
  gameMode: 'exploration' | 'dialogue' | 'puzzle' | 'inventory';
}

// Telegram Mini App типы
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: any;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  backButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  mainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (eventType: string, eventHandler: (event: any) => void) => void;
  offEvent: (eventType: string, eventHandler: (event: any) => void) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: {
    text?: string;
  }, callback?: (data: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (data: string) => void) => void;
  requestWriteAccess: (callback?: (access: boolean) => void) => void;
  requestContact: (callback?: (contact: {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
    vcard?: string;
  }) => void) => void;
  invokeCustomMethod: (method: string, params?: any, callback?: (data: any) => void) => void;
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
} 