const jwt =  require('jsonwebtoken');

module.exports = (req, res, next) => {
try{
    const token = req.headers.authoriation.split(' ')[1]; 
    jwt.verify(token, //process.env.JWT_KEY
        "secret_this_should_be_longer", function(error, decoded) {
        if (error) {
            res.status(401).json('Unauthorized');
          } else {
            req.userData = { email: decoded.email, userId: decoded.userId };
            next();
          }   
    });
} catch(error) {
    res.status(401).json({message: "You are not authenticated!", req: req.headers.authoriation})
}
};
