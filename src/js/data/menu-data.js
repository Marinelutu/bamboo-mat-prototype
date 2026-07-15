// Real Bamboo Mat menu data (plan §4 — prices exact, subset of the full menu).
// Dietary tags are illustrative for the prototype (footer carries the key).

export const TASTING_MENUS = [
  {
    name: 'The Nikkei Voyage',
    price: '£64pp',
    lines: [
      'The long way around both coastlines.',
      'Raw bar → maki → the grill → dessert.',
      'For the whole table.',
    ],
  },
  {
    name: 'Essence of Nikkei',
    price: '£55pp',
    lines: [
      'The signatures, tightened to the essentials.',
      'Ceviche, maki and the best of the fire.',
      'A shorter voyage, same horizon.',
    ],
  },
  {
    name: 'Vegetarian Tasting',
    price: '£36pp',
    lines: [
      'The green route through Lima and Tokyo.',
      'From veg ceviche to the grilled sweet potato.',
      'Gentle on the land, loud on flavour.',
    ],
  },
];

export const MENU_SECTIONS = [
  {
    id: 'starters',
    title: 'Starters',
    items: [
      { name: 'Cancha', price: '£4', tags: ['VG'] },
      { name: 'Miso Soup', price: '£4.50', tags: ['VG'] },
      { name: 'Edamame', price: '£5', tags: ['VG'] },
      { name: 'Padron Pepper', price: '£6.50', tags: ['VG'] },
      { name: 'Artichoke Tostada', price: '£6.50', tags: ['VG'] },
      { name: 'Gambas Frites', price: '£9.50' },
      { name: 'Veg Ceviche', price: '£9.50', tags: ['VG'] },
      { name: 'Seabass Ceviche', price: '£12.50' },
      { name: 'Tuna Tartar', price: '£14.50' },
      { name: 'Hamachi Tiradito', price: '£14.50' },
      { name: 'Ceviche Deluxe', price: '£17' },
    ],
  },
  {
    id: 'mains',
    title: 'Mains',
    items: [
      { name: 'Grilled Sweet Potato', price: '£12', tags: ['VG'] },
      { name: 'Chicken Teriyaki', price: '£14' },
      { name: 'Salmon Teriyaki', price: '£17' },
      { name: 'Chicken Anticucho', price: '£17' },
      { name: 'Ox Cheek', price: '£20' },
      { name: 'Grilled Octopus', price: '£22.50' },
      { name: 'Lamb Chops', price: '£23' },
      { name: 'Rib-eye Steak', price: '£35' },
    ],
  },
  {
    id: 'maki',
    title: 'Maki',
    items: [
      { name: 'Veg Maki', price: '£9', tags: ['VG'] },
      { name: 'Mango Maki', price: '£10', tags: ['VG'] },
      { name: 'Salmon Avocado', price: '£11' },
      { name: 'Dragon Maki', price: '£13' },
      { name: 'California', price: '£13' },
      { name: 'Philadelphia', price: '£14.50' },
      { name: 'Spicy Tuna', price: '£16.50' },
      { name: 'Hamachi Hot', price: '£16.50' },
      { name: 'Vulcano', price: '£17' },
      { name: 'Unagi', price: '£18' },
      { name: 'Bamboo Maki', price: '£22' },
    ],
  },
  {
    id: 'nigiri',
    title: 'Nigiri & Sashimi',
    note: '2pc / 3pc',
    items: [
      { name: 'Seabass', price: '£5.50 / £5.50' },
      { name: 'Eel', price: '£6 / £6.70' },
      { name: 'Salmon', price: '£6.50 / £7.50' },
      { name: 'Bluefin Tuna', price: '£7 / £8.50' },
      { name: 'Yellowtail', price: '£7 / £8.50' },
      { name: 'Scallop', price: '£8 / £9.60' },
      { name: 'Salmon Aburi', price: '£7.80' },
      { name: 'A4 Wagyu', price: '£11' },
      { name: 'Nikkei Nigiri Set', price: '£18' },
      { name: 'Sashimi Platter for 2', price: '£21' },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    items: [
      { name: 'Mochi Ice Cream', price: '£7' },
      { name: 'Tonka Bean Crème Brûlée', price: '£8.50' },
      { name: 'Yuzu Cheesecake', price: '£8.60' },
      { name: 'Chocolate Fondant', price: '£10' },
    ],
  },
  {
    id: 'cocktails',
    title: 'Signature Cocktails',
    note: 'full wine, sake & bar list available in-house',
    items: [
      { name: 'Pisco Sour', price: '£12.50' },
      { name: 'Nikkei Punch', price: '£12.50' },
      { name: 'Spicy Sakura', price: '£12.50' },
      { name: 'Peruvian Paloma', price: '£13' },
      { name: 'Japanese Highball', price: '£14' },
      { name: 'Yuzu Blossom', price: '£15' },
    ],
  },
];
