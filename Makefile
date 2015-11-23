all: js
	node lib/pcr.js

js:
	babel src/ --out-dir lib/

watch:
	babel --watch src/ --out-dir lib/
