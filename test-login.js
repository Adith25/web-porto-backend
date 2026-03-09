const email = "admin@example.com";
const password = "admin";
fetch("http://localhost:3001/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
}).then(res => res.json()).then(console.log).catch(console.error);
