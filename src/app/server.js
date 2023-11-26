// const express = require('express');
// const next = require('next');
// const session = require('express-session');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // กำหนด session middleware
//   server.use(
//     session({
//       secret: 'your-secret-key', // ค่าเริ่มต้นนี้ควรถูกเปลี่ยน
//       resave: false,
//       saveUninitialized: true,
//     })
//   );

//   server.all('*', (req, res) => {
//     return handle(req, res);
//   });

//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// });
