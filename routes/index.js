const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs');
const _ = require('lodash');
const app = require('../app');

var userdata = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'users.json'), 'utf8'));
var defstr = 'postgres://' + userdata.postgresuser + ':' + userdata.postgrespw + '@localhost:5432/icdataserver'
const connectionString = process.env.DATABASE_URL || defstr
const {Pool} = require('pg');
const pool = new Pool({connectionString: connectionString})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(path.join(__dirname + '/index.html'));
});

// Prefer not to leak this
// router.get('/listusers', (req, res, next) => {
//   pool.query('SELECT * FROM users')
//     .then(d => res.json(d.rows))
//     .catch(e => console.error(e.stack));
// });

router.get('/listjobs/:start/:stop', (req, res, next) => {
  var start = req.params.start
  var stop = req.params.stop
  pool.query('SELECT * FROM jobs WHERE job_id >= ' + start + ' AND job_id <= ' + stop)
    .then(d => res.json(d.rows))
    .catch(e => console.error(e.stack))
});

router.get('/download/:jobid', (req, res, next) => {
  var jobid = req.params.jobid
  pool.query('SELECT jobsubmit FROM jobs WHERE job_id = ' + jobid)
    .then(d => {
        date = new Date(d.rows[0].jobsubmit);
        res.download(path.join(os.homedir(), 'data',
            date.getFullYear() + '-' + _.padStart(date.getMonth()+1, 2, '0') + '-' + _.padStart(date.getDate(), 2, '0'),
            jobid + '.jld'));
    }).catch(e => console.error(e.stack))
});

module.exports = router;
