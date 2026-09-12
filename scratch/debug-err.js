async function check() {
  const r = await fetch('http://localhost:3000/api/standards');
  const t = await r.text();
  const idx = t.indexOf('"err"');
  if (idx !== -1) {
    console.log("ERR FOUND:\n", t.substring(idx, idx + 1000));
  } else {
    console.log("NO ERR KEY, HTML:\n", t.substring(0, 1000));
  }
}
check();
