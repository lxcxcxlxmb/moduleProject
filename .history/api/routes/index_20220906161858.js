const cors = require('cors');
const router = require('express').Router();
const users = require('./users');
const categories = require('./categories');

router.use(cors());

router.use(users);
router.use(categories);

module.exports = router;
