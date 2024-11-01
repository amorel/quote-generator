db = db.getSiblingDB("users");
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [{ role: "readWrite", db: "users" }],
});
