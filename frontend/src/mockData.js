export const mockClients = [
  {
    id: 1,
    address: 'ул. Ленина, 10',
    info: 'Жилой дом',
    coefficient: 0.8,
    highlighted: false,
    legalEntity: 'ООО "Жилстрой"',
    type: 'private',
    comments: 'Регулярные платежи',
    photo: 'https://picsum.photos/400/300'
  },
  {
    id: 2,
    address: 'пр. Мира, 25',
    info: 'Офисное здание',
    coefficient: 90,
    highlighted: true,
    legalEntity: 'ИП Иванов',
    type: 'apartment',
    comments: 'Требуется проверка',
    photo: 'https://picsum.photos/400/300'
  },
  {
    id: 3,
    address: 'ул. Гагарина, 15',
    info: 'Торговый центр',
    coefficient: 0.5,
    highlighted: false,
    legalEntity: 'ООО "Торгсервис"',
    type: 'private',
    comments: 'Стабильный клиент',
    photo: 'https://picsum.photos/400/300'
  }
]

export const mockConsumption = {
  1: {
    consumption: [
      [1, 631],
      [2, 616],
      [3, 645],
      [4, 632],
      [5, 618],
      [6, 625]
    ]
  },
  2: {
    consumption: [
      [1, 450],
      [2, 465],
      [3, 480],
      [4, 475],
      [5, 490],
      [6, 485]
    ]
  },
  3: {
    consumption: [
      [1, 800],
      [2, 820],
      [3, 815],
      [4, 830],
      [5, 825],
      [6, 840]
    ]
  }
} 