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
    tipo: "tropical",
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
    tipo: "clasico",
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
    tipo: "clasico",
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
    tipo: "clasico",
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
    tipo: "clasico",
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
    tipo: "clasico",
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
    tipo: "clasico",
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
    tipo: "tropical",
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
    tipo: "clasico",
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
  },
  {
    nombre: "Fernet con Coca",
    descripcion: "Clásico argentino, amargo y refrescante",
    tipo: "trending",
    imagen: "fernet.jpg",
    ingredientes: [
      "1 parte de fernet",
      "4 partes de gaseosa cola",
      "Hielo"
    ],
    pasos: [
      "Llenar un vaso con hielo",
      "Agregar fernet",
      "Completar con gaseosa cola y revolver suavemente"
    ]
  },
  {
    nombre: "Gancia con Sprite",
    descripcion: "Refrescante, dulce y con notas herbales",
    tipo: "trending",
    imagen: "gancia.jpg",
    ingredientes: [
      "1 parte de Gancia",
      "2 partes de Sprite o gaseosa lima-limón",
      "Rodaja de limón",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Servir Gancia y completar con Sprite",
      "Decorar con una rodaja de limón"
    ]
  },
  {
    nombre: "Gin Tonic",
    descripcion: "Elegante y aromático, con sabor herbal y cítrico",
    tipo: "clasico",
    imagen: "gin_tonic.jpg",
    ingredientes: [
      "50 ml de gin",
      "150 ml de agua tónica",
      "Rodaja de limón o pepino",
      "Hielo"
    ],
    pasos: [
      "Llenar copa balón con hielo",
      "Agregar gin y completar con tónica",
      "Decorar con limón o pepino"
    ]
  },
  {
    nombre: "Sweet Mimosa",
    descripcion: "Dulce, frutal y burbujeante. Ideal para brunch o celebraciones",
    tipo: "con-alcohol",
    imagen: "mimosa.jpg",
    ingredientes: [
      "60 ml de jugo de naranja",
      "90 ml de vino espumante o champaña",
      "1 chorrito de licor de durazno (opcional)"
    ],
    pasos: [
      "Servir el jugo de naranja en copa flauta",
      "Completar con el espumante",
      "Añadir licor de durazno si se desea y no revolver"
    ]
  },
  {
    nombre: "Cuba Libre",
    descripcion: "Fresco, dulce y con un toque de lima",
    tipo: "clasico",
    imagen: "cuba_libre.jpg",
    ingredientes: [
      "50 ml de ron oscuro",
      "Gaseosa cola",
      "Jugo de ½ lima",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Agregar ron y jugo de lima",
      "Completar con gaseosa cola y revolver"
    ]
  },
  {
    nombre: "Sex on the Beach",
    descripcion: "Colorido y frutal, con mezcla de durazno y naranja",
    tipo: "tropical",
    imagen: "sex_on_beach.jpg",
    ingredientes: [
      "40 ml de vodka",
      "20 ml de licor de durazno",
      "60 ml de jugo de naranja",
      "30 ml de jugo de arándano",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Mezclar vodka y licor de durazno",
      "Añadir jugos y revolver suavemente"
    ]
  },
  {
    nombre: "Blue Lagoon",
    descripcion: "Vibrante y tropical, de color azul intenso",
    tipo: "tropical",
    imagen: "blue_lagoon.jpg",
    ingredientes: [
      "40 ml de vodka",
      "20 ml de curaçao azul",
      "100 ml de limonada o gaseosa lima-limón",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Agregar vodka y curaçao azul",
      "Completar con limonada y revolver"
    ]
  },
  {
    nombre: "Tequila Sunrise",
    descripcion: "Dulce y colorido, con efecto de amanecer",
    tipo: "tropical",
    imagen: "tequila_sunrise.jpg",
    ingredientes: [
      "40 ml de tequila",
      "90 ml de jugo de naranja",
      "10 ml de granadina",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Verter tequila y jugo de naranja",
      "Agregar la granadina lentamente para el efecto de color"
    ]
  },
  {
    nombre: "Spritz Aperol",
    descripcion: "Ligero, cítrico y burbujeante",
    tipo: "con-alcohol",
    imagen: "spritz_aperol.jpg",
    ingredientes: [
      "60 ml de Aperol",
      "90 ml de espumante o vino blanco seco",
      "Soda",
      "Rodaja de naranja",
      "Hielo"
    ],
    pasos: [
      "Llenar copa con hielo",
      "Agregar Aperol y espumante",
      "Completar con soda y decorar con naranja"
    ]
  },
  {
    nombre: "Caipiroska",
    descripcion: "Versión del caipirinha, pero con vodka",
    tipo: "trending",
    imagen: "caipiroska.jpg",
    ingredientes: [
      "50 ml de vodka",
      "1 lima",
      "2 cdas de azúcar",
      "Hielo"
    ],
    pasos: [
      "Machacar lima con azúcar",
      "Agregar vodka y hielo",
      "Revolver bien"
    ]
  },
  {
    nombre: "Melón con Vino (Melvin)",
    descripcion: "Refrescante clásico veraniego chileno con fruta y vino blanco",
    tipo: "con-alcohol",
    imagen: "melon_vino.jpg",
    ingredientes: [
      "1 melón tuna maduro frío",
      "½ litro de vino blanco frío",
      "½ taza de azúcar (o al gusto)",
      "Frutas extra opcionales: plátano, durazno, frutillas",
      "Hielo"
    ],
    pasos: [
      "Ahuecar el melón: cortar la tapa, sacar semillas y pulpa",
      "Picar la pulpa del melón (y las otras frutas si usás), mezclar con azúcar",
      "Rellenar el melón con esa mezcla y verter el vino blanco frío",
      "Refrigerar o servir bien frío"
    ]
  },
  {
    nombre: "Espresso Martini",
    descripcion: "Clásico emergente, sigue siendo uno de los favoritos por su mezcla de café + energía",
    tipo: "trending",
    imagen: "espresso_martini.jpg",
    ingredientes: [
      "Vodka",
      "Licor de café (tipo Kahlúa u otro)",
      "Café espresso frío",
      "Hielo"
    ],
    pasos: [
      "En coctelera, poner hielo, vodka, licor de café y espresso",
      "Agitar bien",
      "Colar en copa de cóctel, puede decorar con unos granos de café"
    ]
  },
  {
    nombre: "Whiskey Highball",
    descripcion: "Ligero, fácil de beber y muy trendy",
    tipo: "trending",
    imagen: "whiskey_highball.jpg",
    ingredientes: [
      "Whisky (puede ser bourbon, whisky japonés, etc.)",
      "Agua con gas / soda",
      "Twist de limón o rodaja de cítrico",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso alto con hielo",
      "Añadir whisky",
      "Completar con soda",
      "Decorar con limón"
    ]
  },
  {
    nombre: "Paloma Picante",
    descripcion: "Twist de Paloma clásico pero con un toque picante",
    tipo: "trending",
    imagen: "paloma_picante.jpg",
    ingredientes: [
      "Tequila claro",
      "Soda de toronja (o grapefruit soda)",
      "Jugo de lima",
      "Jalapeño o chile picado / licor de chile para darle fuego",
      "Hielo"
    ],
    pasos: [
      "Macerar ligeramente el jalapeño con limón (o solo añadir licor de chile)",
      "En vaso con hielo, poner tequila, jugo de lima",
      "Completar con soda de toronja",
      "Revolver suavemente, decorar con rodaja de chile o lima"
    ]
  },
  {
    nombre: "Dark 'N' Stormy",
    descripcion: "Trago fuerte pero refrescante, con un rol visual 'storm cloud'",
    tipo: "trending",
    imagen: "dark_stormy.jpg",
    ingredientes: [
      "Ron oscuro",
      "Ginger beer frío",
      "Jugo de lima (opcional)",
      "Rodaja de lima para decorar",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso alto con hielo",
      "Verter ginger beer",
      "Flotar el ron oscuro encima (vertir lento por una cuchara)",
      "Añadir el jugo de lima si querés sabor cítrico extra"
    ]
  },
  {
    nombre: "Vesper (James Bond)",
    descripcion: "Cocktail elegante al estilo 007",
    tipo: "clasico",
    imagen: "vesper.jpg",
    ingredientes: [
      "3 partes de ginebra",
      "1 parte de vodka",
      "½ parte de Lillet Blanc (o algún aperitivo similar)",
      "Twist de limón"
    ],
    pasos: [
      "Agitar con hielo la ginebra, vodka y Lillet",
      "Colar en copa de cóctel fría",
      "Decorar con un twist de limón"
    ]
  },
  {
    nombre: "White Russian (The Big Lebowski)",
    descripcion: "El trago ícono de 'El Nota'",
    tipo: "clasico",
    imagen: "white_russian.jpg",
    ingredientes: [
      "Vodka",
      "Licor de café (tipo Kahlúa)",
      "Crema o leche"
    ],
    pasos: [
      "En vaso corto con hielo, verter vodka y licor de café",
      "Agregar la crema por encima",
      "Revolver suavemente antes de beber"
    ]
  },
  {
    nombre: "The Godfather",
    descripcion: "Inspirado por la saga The Godfather",
    tipo: "clasico",
    imagen: "godfather.jpg",
    ingredientes: [
      "Scotch whisky",
      "Amaretto"
    ],
    pasos: [
      "Llenar vaso 'old fashioned' con hielo",
      "Verter whisky y amaretto",
      "Revolver con cuchara"
    ]
  },
  {
    nombre: "Blood and Sand",
    descripcion: "Clásico llamado así por la película Blood and Sand",
    tipo: "clasico",
    imagen: "blood_sand.jpg",
    ingredientes: [
      "Scotch",
      "Vermut dulce",
      "Cherry Heering",
      "Jugo de naranja sanguina ('blood orange')"
    ],
    pasos: [
      "Agitar todo con hielo",
      "Colar en copa de cóctel",
      "Decorar con una rodaja de naranja sanguina"
    ]
  },
  {
    nombre: "Bronx Cocktail",
    descripcion: "Mencionado en la película The Thin Man",
    tipo: "clasico",
    imagen: "bronx_cocktail.jpg",
    ingredientes: [
      "Ginebra",
      "Vermut dulce",
      "Vermut seco",
      "Jugo de naranja"
    ],
    pasos: [
      "Agitar todos los ingredientes con hielo",
      "Colar en copa de cóctel fría",
      "Decorar con twist de naranja"
    ]
  },
  {
    nombre: "Baileys con Helado",
    descripcion: "Suave, cremoso y delicioso, ideal para el postre",
    tipo: "postre",
    imagen: "baileys_helado.jpg",
    ingredientes: [
      "50 ml de Baileys",
      "2 bochas de helado de vainilla",
      "Hielo (opcional)"
    ],
    pasos: [
      "Colocar helado en un vaso o copa",
      "Verter el Baileys encima",
      "Podés licuarlo si querés una textura más cremosa"
    ]
  },
  {
    nombre: "Mudslide",
    descripcion: "El cóctel más parecido a un postre de chocolate",
    tipo: "postre",
    imagen: "mudslide.jpg",
    ingredientes: [
      "30 ml de vodka",
      "30 ml de licor de café",
      "30 ml de Baileys",
      "Hielo"
    ],
    pasos: [
      "Colocar todo en coctelera con hielo",
      "Agitar y servir en vaso frío",
      "Podés decorar con jarabe de chocolate o crema batida"
    ]
  },
  {
    nombre: "Chocolate Martini",
    descripcion: "Dulce y elegante, para fans del chocolate",
    tipo: "postre",
    imagen: "chocolate_martini.jpg",
    ingredientes: [
      "40 ml de vodka",
      "20 ml de licor de cacao o crema de chocolate",
      "10 ml de crema o leche",
      "Hielo"
    ],
    pasos: [
      "Agitar todo con hielo",
      "Colar en copa de cóctel",
      "Decorar con cacao o sirope de chocolate"
    ]
  },
  {
    nombre: "Baby Guinness",
    descripcion: "Trago corto, con efecto visual de una mini pinta de cerveza",
    tipo: "shot",
    imagen: "baby_guinness.jpg",
    ingredientes: [
      "25 ml de licor de café (Kahlúa o Tía María)",
      "10 ml de Baileys"
    ],
    pasos: [
      "Servir licor de café en un shot",
      "Flotar cuidadosamente el Baileys arriba (queda como espuma)"
    ]
  },
  {
    nombre: "White Chocolate Dream",
    descripcion: "Suave, cremoso y con sabor a chocolate blanco",
    tipo: "postre",
    imagen: "white_chocolate_dream.jpg",
    ingredientes: [
      "30 ml de Baileys",
      "20 ml de crema de cacao blanca",
      "50 ml de leche",
      "Hielo"
    ],
    pasos: [
      "Licuar todos los ingredientes con hielo",
      "Servir en vaso alto",
      "Decorar con virutas de chocolate blanco"
    ]
  },
  {
    nombre: "After Eight",
    descripcion: "Inspirado en los famosos chocolates de menta",
    tipo: "postre",
    imagen: "after_eight.jpg",
    ingredientes: [
      "30 ml de Baileys",
      "20 ml de licor de menta",
      "20 ml de licor de chocolate o cacao",
      "Hielo"
    ],
    pasos: [
      "Mezclar todo en coctelera con hielo",
      "Servir en vaso corto",
      "Decorar con hojas de menta o chocolate rallado"
    ]
  },
  {
    nombre: "Oreo Shake (con alcohol)",
    descripcion: "Dulce, frío y con textura espesa",
    tipo: "postre",
    imagen: "oreo_shake.jpg",
    ingredientes: [
      "2 galletitas Oreo",
      "2 bochas de helado de vainilla",
      "40 ml de Baileys o vodka de vainilla",
      "50 ml de leche"
    ],
    pasos: [
      "Licuar todos los ingredientes hasta obtener mezcla cremosa",
      "Servir en vaso grande",
      "Decorar con una Oreo arriba"
    ]
  },
  {
    nombre: "Caramel Cream",
    descripcion: "Dulce y con notas a caramelo tostado",
    tipo: "postre",
    imagen: "caramel_cream.jpg",
    ingredientes: [
      "40 ml de Baileys o licor de crema",
      "20 ml de licor de caramelo o dulce de leche",
      "Leche fría o crema",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Agregar ambos licores y leche",
      "Revolver y decorar con caramelo líquido"
    ]
  },
  {
    nombre: "Tiramisú Drink",
    descripcion: "Inspirado en el clásico postre italiano",
    tipo: "postre",
    imagen: "tiramisu_drink.jpg",
    ingredientes: [
      "30 ml de licor de café",
      "30 ml de Baileys",
      "30 ml de crema o leche condensada",
      "Cacao en polvo"
    ],
    pasos: [
      "Agitar los líquidos con hielo",
      "Colar en copa o vaso pequeño",
      "Espolvorear cacao por encima"
    ]
  },
  {
    nombre: "Banana Split Shot",
    descripcion: "Mini trago dulce con sabor a banana y chocolate",
    tipo: "shot",
    imagen: "banana_split_shot.jpg",
    ingredientes: [
      "20 ml de licor de banana",
      "20 ml de Baileys",
      "20 ml de licor de chocolate"
    ],
    pasos: [
      "Verter los ingredientes en orden sobre una cuchara para que queden en capas",
      "Servir frío"
    ]
  },
  {
    nombre: "Fernet Menta",
    descripcion: "Una variante refrescante del clásico fernet con coca",
    tipo: "trending",
    imagen: "fernet_menta.jpg",
    ingredientes: [
      "50 ml de fernet",
      "100 ml de gaseosa de menta o soda fría",
      "Hielo"
    ],
    pasos: [
      "Servir el fernet sobre el hielo",
      "Agregar la gaseosa de menta",
      "Mezclar suavemente"
    ]
  },
  {
    nombre: "Licor Legui con Pomelo",
    descripcion: "Tradicional, dulce y con un toque cítrico",
    tipo: "trending",
    imagen: "legui_pomelo.jpg",
    ingredientes: [
      "50 ml de Legui",
      "100 ml de gaseosa de pomelo",
      "Hielo"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Agregar Legui",
      "Completar con pomelo"
    ]
  },
  {
    nombre: "Cynar con Pomelo",
    descripcion: "Agridulce, fresco y re de verano",
    tipo: "trending",
    imagen: "cynar_pomelo.jpg",
    ingredientes: [
      "50 ml de Cynar",
      "100 ml de gaseosa de pomelo",
      "Hielo y rodaja de limón"
    ],
    pasos: [
      "Servir Cynar con hielo",
      "Agregar pomelo y decorar con limón"
    ]
  },
  {
    nombre: "Negroni Argento",
    descripcion: "Versión local del clásico italiano",
    tipo: "clasico",
    imagen: "negroni_argento.jpg",
    ingredientes: [
      "30 ml de gin argentino",
      "30 ml de Campari",
      "30 ml de vermut rosso",
      "Hielo y rodaja de naranja"
    ],
    pasos: [
      "Mezclar todo en vaso corto con hielo",
      "Decorar con naranja"
    ]
  },
  {
    nombre: "Clericó",
    descripcion: "El trago del verano argentino, ideal para compartir",
    tipo: "tropical",
    imagen: "clerico.jpg",
    ingredientes: [
      "Vino blanco o rosado",
      "Frutas cortadas (durazno, manzana, naranja, banana)",
      "Azúcar y soda (opcional)"
    ],
    pasos: [
      "Mezclar vino y frutas en jarra grande",
      "Dejar enfriar en la heladera",
      "Servir con hielo"
    ]
  },
  {
    nombre: "Caipiriña de Fernet",
    descripcion: "Versión argenta de la clásica brasileña",
    tipo: "trending",
    imagen: "caipirinha_fernet.jpg",
    ingredientes: [
      "40 ml de fernet",
      "2 cucharaditas de azúcar",
      "1/2 lima cortada en trozos",
      "Hielo"
    ],
    pasos: [
      "Machacar la lima con azúcar",
      "Agregar el fernet",
      "Completar con hielo y mezclar"
    ]
  },
  {
    nombre: "Trago de Caña con Limón",
    descripcion: "Típico de invierno, especialmente en el norte argentino",
    tipo: "clasico",
    imagen: "cana_limon.jpg",
    ingredientes: [
      "50 ml de caña",
      "Jugo de medio limón",
      "Miel o azúcar a gusto"
    ],
    pasos: [
      "Mezclar la caña con limón y miel",
      "Servir a temperatura ambiente o tibio"
    ]
  },
  {
    nombre: "Vermut Rosso con Soda",
    descripcion: "Clásico de bar porteño, ideal como aperitivo",
    tipo: "clasico",
    imagen: "vermut_rosso.jpg",
    ingredientes: [
      "90 ml de vermut rosso (tipo Cinzano o Carpano)",
      "Soda o espumante",
      "Rodaja de naranja o aceituna"
    ],
    pasos: [
      "Llenar vaso con hielo",
      "Agregar vermut y soda",
      "Decorar con naranja"
    ]
  },
  {
    nombre: "Speed con Vodka",
    descripcion: "El 'levanta muertos' de los boliches",
    tipo: "trending",
    imagen: "speed_vodka.jpg",
    ingredientes: [
      "1 energizante (Speed o similar)",
      "50 ml de vodka",
      "Hielo"
    ],
    pasos: [
      "Servir el vodka con hielo",
      "Completar con energizante",
      "Mezclar y servir frío"
    ]
  },
  {
    nombre: "Gancia Batido",
    descripcion: "Versión frutal del clásico Gancia con Sprite",
    tipo: "tropical",
    imagen: "gancia_batido.jpg",
    ingredientes: [
      "60 ml de Gancia",
      "30 ml de jugo de naranja o durazno",
      "Hielo"
    ],
    pasos: [
      "Colocar todo en licuadora con hielo",
      "Licuar hasta espumar",
      "Servir frío"
    ]
  },
  {
    nombre: "Caipiroska de Frutilla",
    descripcion: "Popular en bares argentinos",
    tipo: "tropical",
    imagen: "caipiroska_frutilla.jpg",
    ingredientes: [
      "50 ml de vodka",
      "3 frutillas frescas",
      "2 cucharaditas de azúcar",
      "1/2 lima",
      "Hielo"
    ],
    pasos: [
      "Machacar frutillas, azúcar y lima",
      "Agregar vodka",
      "Completar con hielo y mezclar"
    ]
  },
  {
    nombre: "Vino Batido",
    descripcion: "Clásico casero argentino, energético y dulce — muy común en el interior del país",
    tipo: "clasico",
    imagen: "vino_batido.jpg",
    ingredientes: [
      "1 copa de vino tinto (mejor si es suave o dulce)",
      "1 yema de huevo",
      "1 cucharadita de azúcar (opcional)"
    ],
    pasos: [
      "Batir la yema con azúcar hasta que espume",
      "Agregar el vino de a poco mientras seguís batiendo",
      "Servir inmediatamente, bien aireado"
    ]
  },
  {
    nombre: "Mai Tai",
    descripcion: "Tropical, frutal y con buen golpe de ron",
    tipo: "tropical",
    imagen: "mai_tai.jpg",
    ingredientes: [
      "40 ml de ron blanco",
      "20 ml de ron oscuro",
      "15 ml de triple sec",
      "15 ml de jugo de lima",
      "10 ml de almíbar o granadina",
      "Hielo"
    ],
    pasos: [
      "Mezclar todo con hielo",
      "Servir en vaso corto",
      "Decorar con menta o rodaja de piña"
    ]
  }
];