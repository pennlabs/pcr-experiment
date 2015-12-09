all: js
	node lib/pcr.js

js:
	babel src/ --out-dir lib/
	babel public/js/esindex.js --out-file public/js/index.js

watch:
	babel --watch src/ --out-dir lib/
