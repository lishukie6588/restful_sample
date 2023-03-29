var mysql = require('mysql');
var pool = mysql.createPool({
   connectionLimit : 10,
   host            : 'portfolio.cagb1ij7v9gq.us-east-1.rds.amazonaws.com',
   user            : 'shukie',
   password        : 'Gummyw0rm5',
   database        : 'review',
   port            : 3306
});
module.exports.pool = pool;
