// Base de datos de tragos
const tragos = [
  {
    nombre: "Mojito",
    descripcion: "Cóctel cubano refrescante con ron blanco, menta, lima y soda",
    tipo: "con-alcohol",
    imagen: "mojito.jpg",
    ingredientes: [
      "2 oz Ron blanco",
      "8-10 hojas de menta fresca",
      "1/2 lima",
      "2 cucharaditas de azúcar",
      "Soda water",
      "Hielo"
    ],
    pasos: [
      "Macera la menta con el azúcar en el fondo del vaso",
      "Agrega el jugo de lima",
      "Llena el vaso con hielo",
      "Vierte el ron",
      "Completa con soda water",
      "Decora con menta fresca"
    ]
  },
  {
    nombre: "Piña Colada",
    descripcion: "Cóctel tropical cremoso con ron, piña y coco",
    tipo: "con-alcohol",
    imagen: "pcolada.jpg",
    ingredientes: [
      "2 oz Ron blanco",
      "3 oz Jugo de piña",
      "1 oz Crema de coco",
      "1/2 oz Jugo de lima",
      "Hielo"
    ],
    pasos: [
      "Combina todos los ingredientes en una coctelera",
      "Agita vigorosamente con hielo",
      "Cuela en un vaso alto con hielo",
      "Decora con piña y cereza"
    ]
  },
  {
    nombre: "Margarita",
    descripcion: "Cóctel mexicano clásico con tequila, lima y triple sec",
    tipo: "con-alcohol",
    imagen: "margarita.jpg",
    ingredientes: [
      "2 oz Tequila blanco",
      "1 oz Triple sec",
      "1 oz Jugo de lima fresco",
      "Sal para el borde",
      "Hielo"
    ],
    pasos: [
      "Prepara el borde del vaso con sal",
      "Combina ingredientes en coctelera con hielo",
      "Agita bien",
      "Cuela en vaso frío con hielo",
      "Decora con rodaja de lima"
    ]
  },
  {
    nombre: "Limonada",
    descripcion: "Bebida refrescante sin alcohol con limón y menta",
    tipo: "sin-alcohol",
    imagen: "limonada.jpg",
    ingredientes: [
      "4 limones frescos",
      "1/2 taza de azúcar",
      "4 tazas de agua",
      "Hojas de menta",
      "Hielo"
    ],
    pasos: [
      "Exprime el jugo de los limones",
      "Mezcla con azúcar hasta disolver",
      "Agrega agua y mezcla bien",
      "Añade hojas de menta",
      "Sirve con hielo y decora con limón"
    ]
  },
  {
    nombre: "Cosmopolitan",
    descripcion: "Cóctel elegante con vodka, arándanos y lima",
    tipo: "con-alcohol",
    imagen: "cosmopolitan.jpg",
    ingredientes: [
      "1.5 oz Vodka",
      "1 oz Triple sec",
      "1/2 oz Jugo de arándanos",
      "1/2 oz Jugo de lima",
      "Hielo"
    ],
    pasos: [
      "Combina todos los ingredientes en coctelera",
      "Agita con hielo",
      "Cuela en copa de cóctel fría",
      "Decora con rodaja de lima"
    ]
  },
  {
    nombre: "Caipirinha",
    descripcion: "Cóctel brasileño tradicional con cachaça y lima",
    tipo: "con-alcohol",
    imagen: "caipirinha.jpg",
    ingredientes: [
      "2 oz Cachaça",
      "1 lima cortada en cuartos",
      "2 cucharadas de azúcar",
      "Hielo"
    ],
    pasos: [
      "Macera la lima con azúcar en el vaso",
      "Agrega hielo hasta llenar",
      "Vierte la cachaça",
      "Mezcla suavemente",
      "Decora con rodaja de lima"
    ]
  },
  {
    nombre: "Daiquiri",
    descripcion: "Cóctel clásico cubano con ron, lima y azúcar",
    tipo: "con-alcohol",
    imagen: "daikiri.jpg",
    ingredientes: [
      "2 oz Ron blanco",
      "1 oz Jugo de lima fresco",
      "1/2 oz Azúcar",
      "Hielo"
    ],
    pasos: [
      "Combina todos los ingredientes en coctelera",
      "Agita vigorosamente con hielo",
      "Cuela en copa de cóctel fría",
      "Decora con rodaja de lima"
    ]
  },
  {
    nombre: "Martini",
    descripcion: "Cóctel elegante con ginebra y vermut seco",
    tipo: "con-alcohol",
    imagen: "martini.jpg",
    ingredientes: [
      "2.5 oz Ginebra",
      "0.5 oz Vermut seco",
      "Aceituna para decorar",
      "Hielo"
    ],
    pasos: [
      "Combina ginebra y vermut en coctelera",
      "Agita con hielo",
      "Cuela en copa de martini fría",
      "Decora con aceituna"
    ]
  },
  {
    nombre: "Negroni",
    descripcion: "Cóctel italiano clásico con ginebra, campari y vermut",
    tipo: "con-alcohol",
    imagen: "negroni.jpg",
    ingredientes: [
      "1 oz Ginebra",
      "1 oz Campari",
      "1 oz Vermut rojo",
      "Rodaja de naranja",
      "Hielo"
    ],
    pasos: [
      "Combina todos los ingredientes en vaso con hielo",
      "Remueve suavemente",
      "Decora con rodaja de naranja",
      "Sirve en vaso con hielo"
    ]
  },
  {
    nombre: "Sangría",
    descripcion: "Bebida española con vino tinto y frutas",
    tipo: "con-alcohol",
    imagen: "sangria.jpg",
    ingredientes: [
      "1 botella vino tinto",
      "1/4 taza brandy",
      "1/4 taza azúcar",
      "Frutas variadas",
      "Hielo"
    ],
    pasos: [
      "Corta frutas en trozos pequeños",
      "Mezcla vino, brandy y azúcar",
      "Agrega las frutas",
      "Refrigera por 2 horas",
      "Sirve con hielo"
    ]
  },
  {
    nombre: "Malibu",
    descripcion: "Cóctel tropical con ron de coco y piña",
    tipo: "con-alcohol",
    imagen: "malibu.jpg",
    ingredientes: [
      "2 oz Ron Malibu",
      "4 oz Jugo de piña",
      "1/2 oz Jugo de lima",
      "Hielo"
    ],
    pasos: [
      "Combina todos los ingredientes en vaso alto",
      "Agrega hielo",
      "Mezcla suavemente",
      "Decora con piña y cereza"
    ]
  },
  {
    nombre: "Campari",
    descripcion: "Aperitivo italiano amargo y refrescante",
    tipo: "con-alcohol",
    imagen: "campari.jpg",
    ingredientes: [
      "2 oz Campari",
      "4 oz Soda water",
      "Rodaja de naranja",
      "Hielo"
    ],
    pasos: [
      "Vierte Campari en vaso con hielo",
      "Completa con soda water",
      "Decora con rodaja de naranja",
      "Sirve inmediatamente"
    ]
  }
];