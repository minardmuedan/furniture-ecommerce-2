const subcategories = {
  sofas: { description: 'Comfortable seating for stylish living spaces.' },
  'coffee-tables': { description: 'Functional centerpiece for your living room.' },
  'tv-stands': { description: 'Sleek support for your entertainment system.' },

  'dining-tables': { description: 'Inviting centerpiece for family meals.' },
  chairs: { description: 'Comfortable seating for any room.' },
  'sideboards-and-buffets': { description: 'Elegant storage for dining essentials.' },

  patio: { description: 'Outdoor comfort for relaxing moments.' },
  'lounge-chairs': { description: 'Stylish seating for outdoor spaces.' },
  tables: { description: 'Versatile surfaces for any occasion outdoors.' },

  beds: { description: 'Restful retreats for peaceful sleep.' },
  nightstands: { description: 'Convenient bedside storage solutions.' },
  dressers: { description: 'Stylish storage for your bedroom essentials.' },

  shelves: { description: 'Open storage for display and functionality.' },
  cabinets: { description: 'Closed storage for a clutter-free look.' },
  wardrobes: { description: 'Ample space for clothing and linens.' },

  'bunk-beds': { description: 'Space-saving sleeping solutions for kids.' },
  'kids-desks': { description: 'Functional study space for learning and creativity.' },
  'toy-storage': { description: 'Organized storage for toys and playthings.' },

  desks: { description: 'Functional workspace solutions for productivity.' },
  'office-chairs': { description: 'Supportive seating for productive workdays.' },
  bookcases: { description: 'Organized display for your favorite reads.' },

  mirrors: { description: 'Reflective accents that enhance light and space.' },
  'accent-chairs': { description: 'Stylish standalone chairs for personality.' },
  'side-tables': { description: 'Chic and functional small tables for decor or essentials.' },
}

const categories = {
  'living-room': {
    description: 'Furniture and decor to create a cozy, stylish, and functional living space.',
    subcategories: {
      sofas: subcategories['bookcases'],
      'coffee-tables': subcategories['coffee-tables'],
      'tv-stands': subcategories['tv-stands'],
    },
  },
  'dining-room': {
    description: 'Furniture for hosting meals, gatherings, and special occasions.',
    subcategories: {
      'dining-tables': subcategories['dining-tables'],
      chairs: subcategories['chairs'],
      'sideboards-and-buffets': subcategories['sideboards-and-buffets'],
    },
  },
  outdoor: {
    description: 'Durable furniture designed for outdoor comfort, relaxation, and gatherings.',
    subcategories: {
      patio: subcategories['patio'],
      'lounge-chairs': subcategories['lounge-chairs'],
      tables: subcategories['tables'],
    },
  },
  bedroom: {
    description: 'Essential furniture for restful and organized bedrooms.',
    subcategories: {
      beds: subcategories['beds'],
      nightstands: subcategories['nightstands'],
      dressers: subcategories['dressers'],
    },
  },
  storage: {
    description: 'Smart storage solutions to keep your home tidy and organized.',
    subcategories: {
      shelves: subcategories['shelves'],
      cabinets: subcategories['cabinets'],
      wardrobes: subcategories['wardrobes'],
    },
  },
  kids: {
    description: 'Fun, safe, and practical furniture designed for kids’ rooms.',
    subcategories: {
      'bunk-beds': subcategories['bunk-beds'],
      'kids-desks': subcategories['kids-desks'],
      'toy-storage': subcategories['toy-storage'],
    },
  },
  office: {
    description: 'Functional and ergonomic furniture for home and work offices.',
    subcategories: {
      desks: subcategories['desks'],
      'office-chairs': subcategories['office-chairs'],
      bookcases: subcategories['bookcases'],
    },
  },
  accents: {
    description: 'Decorative furniture and pieces to add character to any space.',
    subcategories: {
      mirrors: subcategories['mirrors'],
      'accent-chairs': subcategories['accent-chairs'],
      'side-tables': subcategories['side-tables'],
    },
  },
}

const getCategoryTitle = (key: string) =>
  key
    .split('-')

    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
    .replace('And', '&')

type Categories = keyof typeof categories
type Subcategories = keyof typeof subcategories

export { categories, subcategories, getCategoryTitle, type Categories, type Subcategories }
