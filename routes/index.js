var express = require('express');
const {executeQuery} = require("../config/database");
var router = express.Router();
const axios = require('axios');

const IP_ADDRESS = `178.128.17.145`;


router.get('/', function(req, res, next) {
  const games = [
    { code: "TA001", name: "OK HOLD'EM", description: '화끈한 쇼핸드 게임', image: 'https://cdn.usegalileo.ai/sdxl10/ecfa739b-0e1b-4a64-a492-2dccf05b4a96.png' },
    { code: "TA002", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    { code: "TA003", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
    { code: "TA004", name: 'OK LIVESPO', description: '실시간 스포츠 게임', image: 'https://cdn.usegalileo.ai/sdxl10/f33656df-b128-476f-97c9-1416c64d6fac.png' },
  ];
  const isLoggedIn = req.session.user;/* check if user is logged in */;
  const userData = req.session.user
  res.render('main', { games, isLoggedIn, ...userData });
});

// Route to handle game start requests
router.get('/game/init', async (req, res) => {
  const userData = req.session.user;
  const {id : userId} = userData;
  const {gameCode} = req.query;

  if(!userData) {
    res.json({
      result: false,
      msg: 'Please login to play games.'
    });
    return;
  }

  try {
    const url = `http://${IP_ADDRESS}:3010/integrator/games/init`;
    const response = await axios.post(url, { gameCode, userId });

    const { data } = response.data;
    const { gameUrl } = data;
    console.log('gameUrl:', gameUrl);

    if (gameUrl) {
      res.json({
        result: true,
        message: 'ok',
        url: gameUrl
      });
    } else {
      res.json({
        result: false,
        message: 'Invalid game code'
      });
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(error.response?.status || 500).json({
      result: false,
      message: error.response?.data?.message || 'Internal server error'
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const rows = await executeQuery(`SELECT * FROM user WHERE username = ? AND passwordHash = ?`, [username, password]);
  const isLoggedIn = rows.length > 0;

  const {id, displayName, email} = rows[0];

  const userData = isLoggedIn ? {
    id,
    username: displayName,
    cash: 1000000,
    gold: 50060055,
    silver: 10000,
    avatar_url: '/images/avatar/f_0.png' // Replace with actual avatar URL
  } : {};

  req.session.user = userData;

  // res.render('main', { error: 'Invalid credentials', isLoggedIn, ...userData });
  res.redirect('/');
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
