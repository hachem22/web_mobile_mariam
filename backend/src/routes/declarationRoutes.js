const express = require('express');
const router = express.Router();
const { createDeclaration, getDeclarations, updateDeclaration } = require('../controllers/declarationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createDeclaration)
    .get(protect, getDeclarations);

router.route('/:id')
    .put(protect, updateDeclaration);

module.exports = router;
