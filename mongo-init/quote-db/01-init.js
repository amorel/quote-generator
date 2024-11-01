print("Starting initialization of quotes database");

db = db.getSiblingDB("quotes");
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{ role: "readWrite", db: "quotes" }],
});

print("Quotes database initialization completed");
