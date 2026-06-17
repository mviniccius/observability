const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/alunosController');

router.get('/',     ctrl.list);
router.get('/:id',  ctrl.findById);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.patch('/:id',ctrl.patch);
router.delete('/:id',ctrl.remove);

module.exports = router;
