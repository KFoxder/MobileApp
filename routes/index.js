
/*
 * GET home page.
 */

exports.index = function(req, res){
  req.session.message = 'Hello!';
};