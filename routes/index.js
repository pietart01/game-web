var express = require('express');
const {executeQuery} = require("../config/database");
var router = express.Router();
const axios = require('axios');

// const IP_ADDRESS = `api`;
console.log(`process.env.API_URL: ${process.env.API_URL}`);

async function getGameInfoList() {
  const games = await executeQuery('SELECT * FROM gameInfo', []);
  // console.log('games:', games);
  return games;
}

async function getUser(userId) {
  const user = await executeQuery('SELECT * FROM user where id = ?', [userId]);
  if(user.length > 0) {
    return user[0];
  }
  return null;
}


router.get('/', async function(req, res, next) {
  const games = await getGameInfoList();
  const isLoggedIn = req.session.user;
  let userData = {};

  if(isLoggedIn) {
    userData = req.session.user;

    const {id: userId} = userData;
    console.log('userId:', userId);
    const user = await getUser(userId);
    const {balance} = user;
    console.log('balance:', balance);

    userData.cash = 0;
    userData.username = user.displayName;
  }

  res.render('main', { games, isLoggedIn, ...userData });
});

// Route to handle game start requests
router.get('/game/init', async (req, res) => {
  try {
    const userData = req.session.user;
    const {id : userId} = userData;
    const {gameCode} = req.query;

    console.log('userData', userData);

    if(!userData) {
      res.json({
        result: false,
        msg: 'Please login to play games.'
      });
      return;
    }

    const url = `${process.env.API_URL}/integrator/games/init`;
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
    console.error('Error fetching game data:', error.response?.status, error.response?.message);
    res.status(error.response?.status || 500).json({
      result: false,
      message: error.response?.data?.message || 'Internal server error'
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const rows = await executeQuery(`SELECT * FROM user WHERE username = ? AND passwordHash = ?`, [username, password]);
    const isLoggedIn = rows.length > 0;

    if(isLoggedIn) {
      const {id, displayName, email, balance, silver} = rows[0];


      const userData = isLoggedIn ? {
        id,
        username: displayName,
        cash: 0,
        gold: balance,
        silver: silver,
        avatar_url: '/images/avatar/am_1.jpg' // Replace with actual avatar URL
      } : {};

      console.log(`userData: ${JSON.stringify(userData)}`)

      req.session.user = userData;
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    res.redirect('/');
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

// routes/index.js
router.get('/avatar-shop', async (req, res) => {
  // Example data. In a real app, fetch from DB, e.g.:
  // const avatars = await executeQuery('SELECT * FROM avatars', []);
  const avatars = [
    {
      id: 1,
      title: 'Avatar Name 1',
      description: 'A short description for Avatar 1.',
      price: 1000,
      image: '/images/avatar/am_1.jpg',
    },
    {
      id: 2,
      title: 'Avatar Name 2',
      description: 'A short description for Avatar 2.',
      price: 1500,
      image: '/images/avatar/am_2.jpg',
    },
    {
      id: 3,
      title: 'Avatar Name 3',
      description: 'A short description for Avatar 3.',
      price: 2000,
      image: '/images/avatar/am_3.jpg',
    },
    {
      id: 4,
      title: 'Avatar Name 4',
      description: 'A short description for Avatar 4.',
      price: 2500,
      image: '/images/avatar/am_4.jpg',
    },
    {
      id: 5,
      title: 'Avatar Name 5',
      description: 'A short description for Avatar 5.',
      price: 3000,
      image: '/images/avatar/am_5.jpg',
    },
    {
      id: 6,
      title: 'Avatar Name 6',
      description: 'A short description for Avatar 6.',
      price: 3500,
      image: '/images/avatar/am_6.jpg',
    },
    // Add more items if you like...
  ];

  console.log('avatars:', avatars);

  res.render('avatarShop', { avatars });
});



module.exports = router;
