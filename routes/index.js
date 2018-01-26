const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const _ = require('lodash');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/juliatests'
const {Pool} = require('pg');
const pool = new Pool({connectionString: connectionString})

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(path.join(__dirname + '/index.html'))
  res.render(path.join(__dirname + '/index.html'));
});

router.get('/listusers', (req, res, next) => {
  pool.query('SELECT * FROM users')
    .then(d => res.json(d.rows))
    .catch(e => console.error(e.stack));
});

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
