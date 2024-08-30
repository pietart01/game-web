var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const games = [
    { name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    { name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    // Add more games here
  ];
  const isLoggedIn = true;/* check if user is logged in */;
  const userData = isLoggedIn ? {
    username: '원숭이',
    cash: 1000000,
    gold: 50060055,
    silver: 10000,
    avatar_url: '/images/avatar/f_0.png' // Replace with actual avatar URL
  } : {};

  res.render('main', { games, isLoggedIn, ...userData });
});

router.post('/login', function (req, res, next) {
  res.json({ success: true });
})

module.exports = router;
