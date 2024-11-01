db = db.getSiblingDB("auth");
db.createUser({
  user: "admin",
  pwd: "your_secure_password_here",
  roles: [{ role: "readWrite", db: "auth" }],
});

db = db.getSiblingDB("quotes");
db.createUser({
  user: "admin",
  pwd: "your_secure_password_here",
  roles: [{ role: "readWrite", db: "quotes" }],
});

db = db.getSiblingDB("users");
db.createUser({
  user: "admin",
  pwd: "your_secure_password_here",
  roles: [{ role: "readWrite", db: "users" }],
});
