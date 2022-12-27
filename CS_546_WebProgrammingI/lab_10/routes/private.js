const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if(req.session.user){
        res.render('private', { "title": "private" , "username":req.session.user.username});
    }else{
        res.status(403).render('error',{ "title": "notLogin" , "notLogin":"You are not login!"});
    }
    
});

module.exports = router;