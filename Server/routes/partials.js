var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:filename', function(req, res, next) {
    res.render('../Frontend/partials/' + req.params.filename);
});

module.exports = router;
