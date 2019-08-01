const express = require('express');
const path = require('path')
const multer = require('multer')
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/:id', (req, res) => {
	const id = req.params.id;
	db.then(client => {
		client.query("select * from board where id = ?", [id], (err, rows) => {
			if (err) {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
			res.json(rows);
		})
	})
})

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from board", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})

router.get('/category/:category', (req, res) => { // retrieve every rows
	const category = req.params.category;
	db.then(client => {
		client.query("select * from board where category = ?", [category], (err, rows) => {
			if (err) {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			} else {
				return res.json(rows);
			}
		});
	})
})
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
	}
})
const upload = multer({
	storage: storage,
	limits: 10 * 1024 * 1024
})
router.post('/images', upload.array('images'), (req, res, next) => {
	let url = []
	for(var i=0; i<req.files.length; i++) {
		url[i] = `//${process.env.addr}/img/${req.files[i].filename}`
	}
	res.json({ url: url})
})

module.exports.board = router;