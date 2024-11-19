print("Starting initialization of quotes database");

db = db.getSiblingDB("quotes");
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{ role: "readWrite", db: "quotes" }],
});

print("Quotes database initialization completed");

// 02-init-quotes.js
/*
db = db.getSiblingDB("quotes");

print("Starting quotes data initialization...");

db.quotes.insertMany([
  {
    _id: "1",
    content: "Test quote 1",
    author: "Author",
    tags: ["test"],
  },
  {
    _id: "2",
    content: "This is a test quote with proper length",
    author: "Author",
    tags: ["test", "motivation"],
  },
  {
    _id: "WQbJJwEFP1l9",
    content:
      "In the depth of winter, I finally learned that there was within me an invincible summer.",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  },
  ...
]);
*/

// 03-init-authors.js
/*
db = db.getSiblingDB("quotes");

db.authors.insertMany([
  {
    _id: "7E6EppQX9_ha",
    name: "Alice Walker",
    link: "https://en.wikipedia.org/wiki/Alice_Walker",
    bio: "Alice Walker (born February 9, 1944) is an American novelist, short story writer, poet, and social activist. In 1982, she wrote the novel The Color Purple, for which she won the National Book Award for hardcover fiction, and the Pulitzer Prize for Fiction.",
    description: "American author and activist",
  },
  {
    _id: "axdVU-ILRg-V",
    name: "Francis of Assisi",
    link: "https://en.wikipedia.org/wiki/Francis_of_Assisi",
    bio: "Saint Francis of Assisi (Italian: San Francesco d'Assisi, Latin: Sanctus Franciscus Assisiensis), born Giovanni di Pietro di Bernardone, informally named as Francesco, was an Italian Catholic friar, deacon and preacher.",
    description: "Italian Catholic saint",
  },
  {
    _id: "H53hnTtqRrf1",
    name: "Frank Herbert",
    link: "https://en.wikipedia.org/wiki/Frank_Herbert",
    bio: "Franklin Patrick Herbert Jr. (October 8, 1920 – February 11, 1986) was an American science-fiction author best known for the 1965 novel Dune and its five sequels.",
    description: "American science fiction writer",
  },
  ...
]);
*/

// 04-init-tags.js
/*
db = db.getSiblingDB("quotes");

db.tags.insertMany([
  { _id: "OMnUd1CUg", name: "Future" },
  { _id: "krXU-q4FE", name: "Friendship" },
  { _id: "kqzFRe-4V4", name: "Education" },
  ...
]);
*/