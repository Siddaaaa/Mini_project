const express = require('express');
const router = express.Router();
const {
  getPets,
  createPet,
  deletePet,
} = require('../controllers/petController');

router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/:id')
  .delete(deletePet);

module.exports = router;
