// app.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import session from 'express-session';
import axios from 'axios';
import dotenv from 'dotenv';

// Custom middleware imports
import { addViewHelpers } from './middleware/viewHelpers.js';
import { checkAuthState } from './middleware/authMiddleware.js';
import { executeQuery } from './database.js';
import { IS_DEMO } from './config.js';

// Initialize environment variables
dotenv.config({ path: '../.env' });

// Initialize Express application
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Basic middleware setup
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Session configuration - MUST be before any middleware that uses session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware that depends on session
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session?.user;
  res.locals.user = req.session?.user || {};
  res.locals.path = req.path;
  res.locals.IS_DEMO = IS_DEMO;
  next();
});

app.use(addViewHelpers);
app.use(checkAuthState);

// Route handlers
const routeHandlers = {
  async getAvatars() {
    return await executeQuery("SELECT price, title as name, image FROM avatar;", []);
  },

  async getChannels() {
    return await executeQuery(
        "SELECT id as channelId, channelName as name, description as requirement, minimum, baseBlindAmount FROM pokerChannel;",
        []
    );
  },

  async getSlotGames() {
    return await executeQuery(
        "SELECT gameName as title, thumbnailUrl as image, gameCode as code FROM gameInfo WHERE gameCategoryId = 0",
        []
    );
  },

  async getMemberships() {
    return await executeQuery(
        "SELECT id, earnedExp, bonusMoney, monthlyFee, imageUrl, membershipName FROM membership;",
        []
    );
  },

  async authenticateUser(username, password) {
    const rows = await executeQuery(
        'SELECT u.*, a.image avatarImage FROM user u JOIN avatar a ON a.id = u.avatarId WHERE username = ? AND passwordHash = ? LIMIT 1;',
        [username, password]
    );
    return rows[0];
  }
};

// Helper function for view data
const createViewData = (baseData = {}) => ({
  ...baseData,
  IS_DEMO
});

// API Routes
app.get('/api/refresh-user', async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const rows = await executeQuery(
        'SELECT * FROM user WHERE id = ? LIMIT 1;',
        [req.session.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.session.user = { ...req.session.user, ...rows[0] };
    res.json({ success: true, user: req.session.user });
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Page Routes
app.get('/', async (req, res) => {
  try {
    const avatars = await routeHandlers.getAvatars();
    res.render('index', createViewData({
      title: '아바타 상점',
      avatars
    }));
  } catch (error) {
    res.render('index', createViewData({
      title: '아바타 상점',
      avatars: []
    }));
  }
});

app.get('/avatar-shop', async (req, res) => {
  try {
    const avatars = await routeHandlers.getAvatars();
    res.render('avatar-shop', createViewData({
      title: '아바타 상점',
      avatars
    }));
  } catch (error) {
    res.render('avatar-shop', createViewData({
      title: '아바타 상점',
      avatars: []
    }));
  }
});

app.get('/holdem', async (req, res) => {
  try {
    const channels = await routeHandlers.getChannels();
    res.render('holdem', createViewData({
      title: '홀덤',
      channels
    }));
  } catch (error) {
    res.render('holdem', createViewData({
      title: '홀덤',
      channels: []
    }));
  }
});

app.get('/slot', async (req, res) => {
  try {
    const games = await routeHandlers.getSlotGames();
    res.render('slot', createViewData({
      title: '슬롯',
      popularGames: games,
      allGames: games
    }));
  } catch (error) {
    console.error('Error fetching slot games:', error);
    res.render('slot', createViewData({
      title: '슬롯',
      popularGames: [],
      allGames: []
    }));
  }
});

app.get('/membership', async (req, res) => {
  try {
    const memberships = await routeHandlers.getMemberships();
    res.render('membership', createViewData({
      title: '멤버십',
      memberships
    }));
  } catch (error) {
    res.render('membership', createViewData({
      title: '멤버십',
      memberships: []
    }));
  }
});

// Static pages
app.get('/support', (req, res) => res.render('support', createViewData({ title: '게임문의' })));
app.get('/mypage', (req, res) => res.render('mypage', createViewData({ title: '마이페이지' })));
app.get('/register', (req, res) => res.render('register', createViewData({ title: '회원가입' })));

// Authentication Routes
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const user = await routeHandlers.authenticateUser(userId, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    req.session.user = user;
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || '/images/avatar_placeholder.png',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Game Routes
app.get('/game/init', async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.json({
        result: false,
        msg: 'Please login to play games.'
      });
    }

    const { gameCode, roomId } = req.query;
    const response = await axios.post(`${process.env.API_URL}/integrator/games/init`, {
      gameCode,
      userId: req.session.user.id,
      roomId
    });

    const { gameUrl } = response.data.data;

    if (!gameUrl) {
      return res.json({
        result: false,
        message: 'Invalid game code'
      });
    }

    res.json({
      result: true,
      message: 'ok',
      url: gameUrl
    });
  } catch (error) {
    console.error('Error initializing game:', error);
    res.json({
      result: false,
      message: 'Error initializing game'
    });
  }
});

export default app;
