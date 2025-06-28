import { World, Location, Character, Quest, Item, Dialogue } from '@/types';

// Фэнтезийный мир
export const fantasyWorld: World = {
  id: 'fantasy',
  name: 'Королевство Эльдария',
  description: 'Древнее королевство, где магия и меч правят миром. Здесь обитают эльфы, гномы, люди и другие расы. Темные силы угрожают миру, и только герой может спасти королевство.',
  genre: 'fantasy',
  imageUrl: '/images/fantasy-world.jpg',
  isUnlocked: true,
  locations: [
    {
      id: 'fantasy-forest',
      name: 'Темный лес',
      description: 'Древний лес, полный тайн и опасностей. Ветви деревьев скрипят на ветру, а в глубине слышны странные звуки.',
      imageUrl: '/images/fantasy-forest.jpg',
      connections: ['fantasy-village', 'fantasy-cave'],
      characters: ['fantasy-elf', 'fantasy-druid'],
      items: [],
      isVisited: false
    },
    {
      id: 'fantasy-village',
      name: 'Деревня Ривэндейл',
      description: 'Уютная деревня, окруженная зелеными холмами. Местные жители дружелюбны и всегда готовы помочь путнику.',
      imageUrl: '/images/fantasy-village.jpg',
      connections: ['fantasy-forest', 'fantasy-castle'],
      characters: ['fantasy-villager', 'fantasy-merchant'],
      items: [],
      isVisited: false
    },
    {
      id: 'fantasy-castle',
      name: 'Замок Короля',
      description: 'Величественный замок, возвышающийся над королевством. Здесь живет король и его двор, принимая важные решения.',
      imageUrl: '/images/fantasy-castle.jpg',
      connections: ['fantasy-village', 'fantasy-tower'],
      characters: ['fantasy-king', 'fantasy-wizard'],
      items: [],
      isVisited: false
    },
    {
      id: 'fantasy-cave',
      name: 'Пещера Дракона',
      description: 'Мрачная пещера, где обитает древний дракон. Сокровища и опасности ждут смельчаков внутри.',
      imageUrl: '/images/fantasy-cave.jpg',
      connections: ['fantasy-forest'],
      characters: ['fantasy-dragon'],
      items: [],
      isVisited: false
    },
    {
      id: 'fantasy-tower',
      name: 'Башня Магов',
      description: 'Высокая башня, где изучают древние искусства магии. Здесь хранятся секреты и знания веков.',
      imageUrl: '/images/fantasy-tower.jpg',
      connections: ['fantasy-castle'],
      characters: ['fantasy-archmage'],
      items: [],
      isVisited: false
    }
  ],
  characters: [
    {
      id: 'fantasy-elf',
      name: 'Элара',
      description: 'Мудрая эльфийка, хранительница леса. Она знает все тайны природы и может помочь в путешествии.',
      imageUrl: '/images/fantasy-elf.jpg',
      personality: 'Мудрая и заботливая, но осторожная с незнакомцами',
      dialogues: [
        {
          id: 'elf-greeting',
          text: 'Приветствую тебя, путник. Я Элара, хранительница этого леса. Что привело тебя в наши земли?',
          options: [
            {
              id: 'elf-help',
              text: 'Мне нужна помощь в поисках древнего артефакта',
              consequences: [
                { type: 'quest_progress', target: 'fantasy-artifact-quest', value: 1 }
              ]
            },
            {
              id: 'elf-explore',
              text: 'Я просто исследую эти земли',
              consequences: [
                { type: 'trust_change', target: 'fantasy-elf', value: 10 }
              ]
            }
          ]
        }
      ],
      quests: ['fantasy-artifact-quest'],
      isFriendly: true,
      trustLevel: 50
    },
    {
      id: 'fantasy-king',
      name: 'Король Торин',
      description: 'Мудрый и справедливый правитель королевства. Он заботится о своем народе и ищет способы защитить королевство от темных сил.',
      imageUrl: '/images/fantasy-king.jpg',
      personality: 'Мудрый, справедливый, но обеспокоенный угрозами',
      dialogues: [
        {
          id: 'king-greeting',
          text: 'Добро пожаловать в мой замок, герой. Королевство нуждается в твоей помощи против темных сил.',
          options: [
            {
              id: 'king-accept',
              text: 'Я готов служить королевству',
              consequences: [
                { type: 'quest_progress', target: 'fantasy-main-quest', value: 1 },
                { type: 'trust_change', target: 'fantasy-king', value: 20 }
              ]
            },
            {
              id: 'king-decline',
              text: 'Мне нужно время подумать',
              consequences: [
                { type: 'trust_change', target: 'fantasy-king', value: -10 }
              ]
            }
          ]
        }
      ],
      quests: ['fantasy-main-quest'],
      isFriendly: true,
      trustLevel: 80
    }
  ],
  quests: [
    {
      id: 'fantasy-main-quest',
      name: 'Спасение Королевства',
      description: 'Темные силы угрожают королевству. Нужно найти древний артефакт и победить зло.',
      objectives: [
        {
          id: 'find-artifact',
          description: 'Найти древний артефакт в пещере дракона',
          type: 'collect_item',
          target: 'ancient-artifact',
          isCompleted: false
        },
        {
          id: 'defeat-dark-lord',
          description: 'Победить темного владыку',
          type: 'talk_to_character',
          target: 'fantasy-dark-lord',
          isCompleted: false
        }
      ],
      rewards: [
        { type: 'item', target: 'legendary-sword', value: 1 },
        { type: 'location_unlock', target: 'fantasy-secret-chamber', value: 1 }
      ],
      isCompleted: false,
      isActive: false,
      giverId: 'fantasy-king'
    },
    {
      id: 'fantasy-artifact-quest',
      name: 'Поиск Артефакта',
      description: 'Элара просит найти древний артефакт, который поможет защитить лес.',
      objectives: [
        {
          id: 'search-forest',
          description: 'Исследовать темный лес',
          type: 'visit_location',
          target: 'fantasy-forest',
          isCompleted: false
        },
        {
          id: 'find-artifact-piece',
          description: 'Найти часть артефакта',
          type: 'collect_item',
          target: 'artifact-piece',
          isCompleted: false
        }
      ],
      rewards: [
        { type: 'trust', target: 'fantasy-elf', value: 30 },
        { type: 'item', target: 'magic-herb', value: 3 }
      ],
      isCompleted: false,
      isActive: false,
      giverId: 'fantasy-elf'
    }
  ]
};

// Научно-фантастический мир
export const scifiWorld: World = {
  id: 'sci-fi',
  name: 'Галактика Нексус',
  description: 'Далёкое будущее, где человечество освоило космос и встретило другие цивилизации. Технологии и инопланетные расы сосуществуют в сложной политической системе.',
  genre: 'sci-fi',
  imageUrl: '/images/scifi-world.jpg',
  isUnlocked: true,
  locations: [
    {
      id: 'scifi-space-station',
      name: 'Космическая станция Альфа',
      description: 'Огромная космическая станция, центр торговли и дипломатии между различными расами галактики.',
      imageUrl: '/images/scifi-station.jpg',
      connections: ['scifi-planet', 'scifi-ship'],
      characters: ['scifi-captain', 'scifi-alien'],
      items: [],
      isVisited: false
    },
    {
      id: 'scifi-planet',
      name: 'Планета Ксенон',
      description: 'Загадочная планета с необычной экосистемой. Здесь можно найти редкие ресурсы и древние артефакты.',
      imageUrl: '/images/scifi-planet.jpg',
      connections: ['scifi-space-station', 'scifi-ruins'],
      characters: ['scifi-scientist', 'scifi-native'],
      items: [],
      isVisited: false
    }
  ],
  characters: [
    {
      id: 'scifi-captain',
      name: 'Капитан Сара Коннорс',
      description: 'Опытный капитан космического корабля, известная своими исследованиями дальних уголков галактики.',
      imageUrl: '/images/scifi-captain.jpg',
      personality: 'Смелая, решительная, но осторожная',
      dialogues: [
        {
          id: 'captain-greeting',
          text: 'Добро пожаловать на борт, исследователь. Готов ли ты к приключениям в глубинах космоса?',
          options: [
            {
              id: 'captain-ready',
              text: 'Готов к любым приключениям!',
              consequences: [
                { type: 'quest_progress', target: 'scifi-exploration-quest', value: 1 }
              ]
            }
          ]
        }
      ],
      quests: ['scifi-exploration-quest'],
      isFriendly: true,
      trustLevel: 60
    }
  ],
  quests: [
    {
      id: 'scifi-exploration-quest',
      name: 'Исследование Неизвестного',
      description: 'Исследовать загадочные руины на планете Ксенон и найти древние технологии.',
      objectives: [
        {
          id: 'explore-ruins',
          description: 'Исследовать древние руины',
          type: 'visit_location',
          target: 'scifi-ruins',
          isCompleted: false
        },
        {
          id: 'find-tech',
          description: 'Найти древние технологии',
          type: 'collect_item',
          target: 'ancient-tech',
          isCompleted: false
        }
      ],
      rewards: [
        { type: 'item', target: 'advanced-weapon', value: 1 },
        { type: 'location_unlock', target: 'scifi-secret-lab', value: 1 }
      ],
      isCompleted: false,
      isActive: false,
      giverId: 'scifi-captain'
    }
  ]
};

// Средневековый мир
export const medievalWorld: World = {
  id: 'medieval',
  name: 'Королевство Вестмарк',
  description: 'Средневековое королевство, где рыцари, замки и монархия правят миром. Интриги, битвы и честь определяют судьбу людей.',
  genre: 'medieval',
  imageUrl: '/images/medieval-world.jpg',
  isUnlocked: true,
  locations: [
    {
      id: 'medieval-castle',
      name: 'Замок Вестмарк',
      description: 'Величественный замок, резиденция короля и центр политической жизни королевства.',
      imageUrl: '/images/medieval-castle.jpg',
      connections: ['medieval-town', 'medieval-dungeon'],
      characters: ['medieval-king', 'medieval-knight'],
      items: [],
      isVisited: false
    },
    {
      id: 'medieval-town',
      name: 'Город Рыцарей',
      description: 'Жизнерадостный город, где живут ремесленники, торговцы и рыцари. Здесь всегда кипит жизнь.',
      imageUrl: '/images/medieval-town.jpg',
      connections: ['medieval-castle', 'medieval-tavern'],
      characters: ['medieval-merchant', 'medieval-bard'],
      items: [],
      isVisited: false
    }
  ],
  characters: [
    {
      id: 'medieval-king',
      name: 'Король Ричард',
      description: 'Мудрый и справедливый король, который правит королевством с честью и достоинством.',
      imageUrl: '/images/medieval-king.jpg',
      personality: 'Мудрый, справедливый, но строгий',
      dialogues: [
        {
          id: 'medieval-king-greeting',
          text: 'Добро пожаловать в мой замок, путник. Королевство нуждается в верных рыцарях.',
          options: [
            {
              id: 'medieval-king-serve',
              text: 'Я готов служить королевству как рыцарь',
              consequences: [
                { type: 'quest_progress', target: 'medieval-knight-quest', value: 1 }
              ]
            }
          ]
        }
      ],
      quests: ['medieval-knight-quest'],
      isFriendly: true,
      trustLevel: 70
    }
  ],
  quests: [
    {
      id: 'medieval-knight-quest',
      name: 'Путь Рыцаря',
      description: 'Стать настоящим рыцарем королевства, пройдя испытания чести и отваги.',
      objectives: [
        {
          id: 'prove-honor',
          description: 'Доказать свою честь и отвагу',
          type: 'talk_to_character',
          target: 'medieval-knight',
          isCompleted: false
        },
        {
          id: 'defeat-bandits',
          description: 'Победить бандитов, угрожающих городу',
          type: 'visit_location',
          target: 'medieval-forest',
          isCompleted: false
        }
      ],
      rewards: [
        { type: 'item', target: 'knight-armor', value: 1 },
        { type: 'item', target: 'noble-sword', value: 1 }
      ],
      isCompleted: false,
      isActive: false,
      giverId: 'medieval-king'
    }
  ]
};

// Древний Египет
export const egyptWorld: World = {
  id: 'egypt',
  name: 'Древний Египет',
  description: 'Земля фараонов, пирамид и древних богов. Магия и мифология переплетаются с реальностью в этом загадочном мире.',
  genre: 'egypt',
  imageUrl: '/images/egypt-world.jpg',
  isUnlocked: true,
  locations: [
    {
      id: 'egypt-pyramid',
      name: 'Великая Пирамида',
      description: 'Древняя пирамида, полная тайн и ловушек. Здесь хранятся сокровища фараонов и древние знания.',
      imageUrl: '/images/egypt-pyramid.jpg',
      connections: ['egypt-temple', 'egypt-tomb'],
      characters: ['egypt-pharaoh', 'egypt-priest'],
      items: [],
      isVisited: false
    },
    {
      id: 'egypt-temple',
      name: 'Храм Богов',
      description: 'Священный храм, где поклоняются древним богам Египта. Здесь можно получить благословение богов.',
      imageUrl: '/images/egypt-temple.jpg',
      connections: ['egypt-pyramid', 'egypt-oasis'],
      characters: ['egypt-high-priest', 'egypt-oracle'],
      items: [],
      isVisited: false
    }
  ],
  characters: [
    {
      id: 'egypt-pharaoh',
      name: 'Фараон Тутанхамон',
      description: 'Молодой фараон, правитель Египта. Он ищет способ защитить свое царство от проклятия.',
      imageUrl: '/images/egypt-pharaoh.jpg',
      personality: 'Мудрый, но обеспокоенный проклятием',
      dialogues: [
        {
          id: 'pharaoh-greeting',
          text: 'Приветствую тебя, путник. Боги привели тебя в мое царство. Поможешь ли ты мне снять проклятие?',
          options: [
            {
              id: 'pharaoh-help',
              text: 'Я готов помочь снять проклятие',
              consequences: [
                { type: 'quest_progress', target: 'egypt-curse-quest', value: 1 }
              ]
            }
          ]
        }
      ],
      quests: ['egypt-curse-quest'],
      isFriendly: true,
      trustLevel: 80
    }
  ],
  quests: [
    {
      id: 'egypt-curse-quest',
      name: 'Проклятие Фараона',
      description: 'Помочь фараону снять древнее проклятие, которое угрожает всему Египту.',
      objectives: [
        {
          id: 'find-scroll',
          description: 'Найти древний свиток с заклинанием',
          type: 'collect_item',
          target: 'ancient-scroll',
          isCompleted: false
        },
        {
          id: 'perform-ritual',
          description: 'Выполнить ритуал в храме богов',
          type: 'visit_location',
          target: 'egypt-temple',
          isCompleted: false
        }
      ],
      rewards: [
        { type: 'item', target: 'pharaoh-crown', value: 1 },
        { type: 'location_unlock', target: 'egypt-secret-chamber', value: 1 }
      ],
      isCompleted: false,
      isActive: false,
      giverId: 'egypt-pharaoh'
    }
  ]
};

export const allWorlds: World[] = [
  fantasyWorld,
  scifiWorld,
  medievalWorld,
  egyptWorld
];

// Проверка наличия миров при загрузке модуля
console.log('[DEBUG] Загрузка worlds.ts, доступные миры:', allWorlds.map(w => w.id));

// Типобезопасный id мира
export type WorldId = 'fantasy' | 'sci-fi' | 'medieval' | 'egypt';

// Проверка валидности id миров
allWorlds.forEach(world => {
  if (!world.id) {
    console.error('[DEBUG] Обнаружен мир с пустым id!', world);
    // Устанавливаем id по умолчанию для миров с пустым id
    world.id = world.genre || 'unknown';
    console.log('[DEBUG] Установлен id по умолчанию:', world.id);
  }
});

// Map для быстрого поиска миров по id
const worldMap: Map<WorldId, World> = new Map(
  allWorlds
    .filter(world => !!world.id) // Только миры с непустым id
    .map(world => [world.id as WorldId, world])
);

// Проверяем, что все миры доступны в Map
console.log('[DEBUG] Миры в worldMap:', Array.from(worldMap.keys()));

// Проверяем, что все типы WorldId представлены в Map
const expectedIds: WorldId[] = ['fantasy', 'sci-fi', 'medieval', 'egypt'];
expectedIds.forEach(id => {
  if (!worldMap.has(id)) {
    console.error(`[DEBUG] Ожидаемый мир с id "${id}" отсутствует в worldMap!`);
  }
});

// Улучшенная функция поиска мира
export const getWorldById = (id: WorldId): World | undefined => {
  const world = worldMap.get(id);
  if (!world) {
    console.error(`Мир с id "${id}" не найден!`);
    console.error('[DEBUG] Доступные миры:', Array.from(worldMap.keys()));
    // Возвращаем первый доступный мир как фоллбэк
    if (worldMap.size > 0) {
      const firstWorld = worldMap.values().next().value;
      console.log('[DEBUG] Возвращаем первый доступный мир:', firstWorld.id);
      return firstWorld;
    }
    return undefined;
  }
  return world;
}; 