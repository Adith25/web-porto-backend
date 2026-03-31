async function test() {
  try {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "admin" })
    });
    const data = await response.json();
    console.log('Login Result:', response.status, data);
  } catch (error) {
    console.log('Request Error:', error.message);
  }
}

test();
