const categories = {
  'living-room': {
    title: 'Living Room',
    description: 'Furniture and decor to create a cozy, stylish, and functional living space.',
    subcategories: {
      sofas: { title: 'Sofas', description: 'Comfortable seating for stylish living spaces.' },
      'coffee-tables': { title: 'Coffee Tables', description: 'Functional centerpiece for your living room.' },
      'tv-stands': { title: 'TV Stands', description: 'Sleek support for your entertainment system.' },
    },
  },
  'dining-room': {
    title: 'Dining Room',
    description: 'Furniture for hosting meals, gatherings, and special occasions.',
    subcategories: {
      'dining-tables': { title: 'Dining Tables', description: 'Inviting centerpiece for family meals.' },
      chairs: { title: 'Chairs', description: 'Comfortable seating for any room.' },
      'sideboards-and-buffets': { title: 'Sideboard & Buffets', description: 'Elegant storage for dining essentials.' },
    },
  },
  outdoor: {
    title: 'Outdoor',
    description: 'Durable furniture designed for outdoor comfort, relaxation, and gatherings.',
    subcategories: {
      benches: { title: 'Patio', description: 'Outdoor comfort for relaxing moments.' },
      'lounge-chairs': { title: 'Garden Chairs', description: 'Stylish seating for outdoor spaces.' },
      tables: { title: 'Tables', description: 'Versatile surfaces for any occasion outdoors.' },
    },
  },
  bedroom: {
    title: 'Bedroom',
    description: 'Essential furniture for restful and organized bedrooms.',
    subcategories: {
      beds: { title: 'Beds', description: 'Restful retreats for peaceful sleep.' },
      nightstands: { title: 'Nightstands', description: 'Convenient bedside storage solutions.' },
      dressers: { title: 'Dressers', description: 'Stylish storage for your bedroom essentials.' },
    },
  },
  storage: {
    title: 'Storage',
    description: 'Smart storage solutions to keep your home tidy and organized.',
    subcategories: {
      shelves: { title: 'Shelves', description: 'Open storage for display and functionality.' },
      cabinets: { title: 'Cabinets', description: 'Closed storage for a clutter-free look.' },
      wardrobes: { title: 'Wardrobes', description: 'Ample space for clothing and linens.' },
    },
  },
  kids: {
    title: 'Kids',
    description: 'Fun, safe, and practical furniture designed for kids’ rooms.',
    subcategories: {
      'bunk-beds': { title: 'Bunk Beds', description: 'Space-saving sleeping solutions for kids.' },
      'kids-desks': { title: 'Kids Desks', description: 'Functional study space for learning and creativity.' },
      'toy-storage': { title: 'Toy Storage', description: 'Organized storage for toys and playthings.' },
    },
  },
  office: {
    title: 'Office',
    description: 'Functional and ergonomic furniture for home and work offices.',
    subcategories: {
      desks: { title: 'Desks', description: 'Functional workspace solutions for productivity.' },
      'office-chairs': { title: 'Office Chairs', description: 'Supportive seating for productive workdays.' },
      bookcases: { title: 'Bookcases', description: 'Organized display for your favorite reads.' },
    },
  },
  accents: {
    title: 'Accents',
    description: 'Decorative furniture and pieces to add character to any space.',
    subcategories: {
      mirrors: { title: 'Mirrors', description: 'Reflective accents that enhance light and space.' },
      'accent-chairs': { title: 'Accent Chairs', description: 'Stylish standalone chairs for personality.' },
      'side-tables': { title: 'Side Tables', description: 'Chic and functional small tables for decor or essentials.' },
    },
  },
}

type Categories = keyof typeof categories
type Subcategories<TCategory extends Categories> = keyof (typeof categories)[TCategory]['subcategories']
type AllSubcategories = { [K in Categories]: keyof (typeof categories)[K]['subcategories'] }[Categories]

export { categories, type Categories, type Subcategories, type AllSubcategories }
