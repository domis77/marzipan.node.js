var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-config.json');
var s3 = new AWS.S3({apiVersion: '2016-03-01'});


module.exports = function() {
    return function(req, res, next) {

        var params = {
            Bucket: "marzipan-projects",
            Key: req.query.key
        };

        s3.getObject(params, function (err, data) {
            if (err) { 
                console.log(err, err.stack);
            }
            else {
                if(data.ContentType == "application/json") 
                    res.send(data.Body.toString('utf-8'));
                if(data.ContentType.includes('image')) {
                    res.type(data.ContentType);
                    res.send(data.Body.toString('base64'));
                }                
            }
        });
    }
}



