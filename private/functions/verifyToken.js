const JWTKEY = require('../constant/jwtKey');
const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, JWTKEY, (err, auth) => {
            if(err) res.status(403).json({"error": "Accesso negato"});
            else {
                let exp = auth.exp;

                //token scaduto
                if (exp<(Date.now/1000)) res.status(440).json({"error": "Sessione scaduta"});
                else {
                    res.auth = auth;
                    next()
                }
            }
        });
    }else{
        res.status(403).json({"error": "Accesso negato"});
    }
}

module.exports = verifyToken; // Esporta il middleware