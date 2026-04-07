import fs from 'fs';
async function run() {
  const host = 'https://stingray-app-u3bsh.ondigitalocean.app/user';
  const response = await fetch(host, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "zzzztest123",
      password: "Password1!",
      firstName: "Test",
      lastName: "User",
      email: "testzz123@test.com"
    })
  });
  console.log("Status:", response.status);
  const text = await response.text();
  fs.writeFileSync('error_output.json', text);
}
run();
