db = db.getSiblingDB("quotes");

db.quotes.insertMany([
  {
    _id: "WQbJJwEFP1l9",
    content:
      "In the depth of winter, I finally learned that there was within me an invincible summer.",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  },
  {
    _id: "Tm5YUGQYMtDk",
    content:
      "To follow, without halt, one aim: There is the secret of success.",
    author: "Anna Pavlova",
    tags: ["Success"],
  },
]);

db.tags.insertMany([
  { _id: "OMnUd1CUg", name: "Future" },
  { _id: "krXU-q4FE", name: "Friendship" },
  { _id: "kqzFRe-4V4", name: "Education" },
]);

db.authors.insertMany([
  {
    _id: "7E6EppQX9_ha",
    name: "Alice Walker",
    link: "https://en.wikipedia.org/wiki/Alice_Walker",
    bio: "Alice Walker is an American novelist...",
    description: "American author and activist",
  },
]);
