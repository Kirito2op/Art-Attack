let users = {};

let closed = {};

function generateRoomID() {
    let roomId = Math.floor(1000 + Math.random() * 9000);
  
    while (users[roomId]) {
      roomId = Math.floor(1000 + Math.random() * 9000);
    }
    users[roomId] = [];
  
    return roomId;
  }

  const words = [
    "apple", "banana", "grape", "orange", "lemon", "peach", "pear", "plum", "strawberry", "watermelon",
    "car", "bus", "bicycle", "motorcycle", "truck", "van", "jeep", "scooter", "tractor", "train",
    "dog", "cat", "elephant", "lion", "tiger", "bear", "rabbit", "mouse", "horse", "cow",
    "chair", "table", "desk", "sofa", "bed", "cabinet", "shelf", "stool", "bench", "wardrobe",
    "sun", "moon", "star", "planet", "comet", "asteroid", "galaxy", "universe", "meteor", "satellite",
    "pen", "pencil", "eraser", "sharpener", "notebook", "book", "ruler", "marker", "crayon", "chalk",
    "guitar", "piano", "drums", "violin", "trumpet", "flute", "saxophone", "harp", "cello", "tambourine",
    "house", "apartment", "villa", "cottage", "mansion", "bungalow", "hut", "castle", "palace", "igloo",
    "beach", "mountain", "forest", "desert", "river", "lake", "ocean", "waterfall", "valley", "canyon",
    "pizza", "burger", "pasta", "sandwich", "salad", "soup", "steak", "sushi", "taco", "noodles",
    "snowman", "balloon", "airplane", "cupcake", "rainbow", "zebra", "robot", "giraffe", "pirate", "telescope",
    "kangaroo", "basketball", "fireworks", "unicorn", "penguin", "dinosaur", "puzzle", "parachute", "carousel", "palm tree"
];

module.exports = { generateRoomID, users, words, closed };