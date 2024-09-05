var express = require('express');
const {executeQuery} = require("../config/database");
var router = express.Router();

// Dummy game data
const games = {
  'TA001': 'https://game.emp555.com/TA001',
  'TA002': 'https://game.emp555.com/TA002',
  'TA003': 'https://game.emp555.com/TA003',
  'TA004': 'https://game.emp555.com/TA004',
  // Add more game codes and URLs as needed
};

/* GET home page. */
router.get('/', function(req, res, next) {
  const games = [
    { code: "TA001", name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { code: "TA002", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    { code: "TA003", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    { code: "TA004", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    // Add more games here
  ];
  const isLoggedIn = req.session.user;/* check if user is logged in */;
  const userData = req.session.user

  res.render('main', { games, isLoggedIn, ...userData });
});

// Route to handle game start requests
router.get('/game/start', (req, res) => {
  const gamecode = req.query.gamecode;

  if(!req.session.user) {
    res.json({
      result: false,
      msg: 'Please login to play games.'
    });
    return;
  }

  if (games[gamecode]) {
    res.json({
      result: true,
      url: games[gamecode]
    });
  } else {
    res.json({
      result: false,
      msg: 'Invalid game code'
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const rows = await executeQuery(`SELECT * FROM user WHERE username = ? AND passwordHash = ?`, [username, password]);
  const isLoggedIn = rows.length > 0;
  const userData = isLoggedIn ? {
    username: '원숭이',
    cash: 1000000,
    gold: 50060055,
    silver: 10000,
    avatar_url: '/images/avatar/f_0.png' // Replace with actual avatar URL
  } : {};

  if (isLoggedIn) {
    req.session.user = {
      username: '원숭이',
      cash: 1000000,
      gold: 50060055,
      silver: 10000,
      avatar_url: '/images/avatar/f_0.png' // Replace with actual avatar URL
    };
    res.redirect('/');
  } else {
    res.redirect('/');
    // res.render('main', { error: 'Invalid credentials', isLoggedIn, ...userData });
  }
});

router.get('/logout', function(req, res) {
  // Destroy the user's session to log them out
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.redirect('/'); // Redirect to home if there's an error
    } else {
      res.redirect('/'); // Redirect to the login page after logout
    }
  });
});

module.exports = router;
