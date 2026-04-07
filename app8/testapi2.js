import fs from 'fs';
async function test() {
  const host = 'https://stingray-app-u3bsh.ondigitalocean.app/user';
  
  const d1 = { username: "t123", password: "Password1!", firstName: "T", lastName: "T", email: "t@o232.com" };
  const d2 = { username: "t123", password: "Password1!", firstName: "T", lastName: "T", email: "t@o222.com" };
  
  let res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d1) });
  console.log("R1:", res.status, await res.text());
  
  res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d2) });
  console.log("R2 (dup user):", res.status, await res.text());

  const d3 = { username: "t444", password: "Password1!", firstName: "T", lastName: "T", email: "t@o232.com" };
  res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d3) });
  console.log("R3 (dup email):", res.status, await res.text());
}
test();
