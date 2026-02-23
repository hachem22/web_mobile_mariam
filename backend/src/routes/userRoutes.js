const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    deleteUser,
    updateUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .post(upload.single('photo'), registerUser)
    .get(protect, getUsers);

router.post('/login', loginUser);

router.route('/:id')
    .put(protect, updateUser)
    .delete(protect, deleteUser);

router.get('/me', protect, getMe);

module.exports = router;
