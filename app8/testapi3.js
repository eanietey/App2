import fs from 'fs';
async function test() {
  const host = 'https://stingray-app-u3bsh.ondigitalocean.app/user';
  
  const d1 = { username: "alpha123", password: "Password1!", firstName: "T", lastName: "T", email: "alpha1@o232.com" };
  const d2 = { username: "alpha123", password: "Password1!", firstName: "T", lastName: "T", email: "alpha2@o222.com" };
  
  let res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d1) });
  console.log("R1:", res.status, await res.text());
  
  res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d2) });
  fs.writeFileSync('err1.json', await res.text());
  console.log("R2 (dup user):", res.status, "saved to err1.json");

  const d3 = { username: "beta1234", password: "Password1!", firstName: "T", lastName: "T", email: "alpha1@o232.com" };
  res = await fetch(host, { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(d3) });
  fs.writeFileSync('err2.json', await res.text());
  console.log("R3 (dup email):", res.status, "saved to err2.json");
}
test();
