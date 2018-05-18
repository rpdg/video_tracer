const COLOR = 'red';

let canvasWidth = 854;
let canvasHeight = 480;

let rateW = 0;
let rateH = 0;


const canvas = document.createElement("canvas");
canvas.id = 'canvas';
const context = canvas.getContext('2d');




let selFilterType = document.getElementById('selFilter');
let filterType = 0;

function setFilterType() {
	filterType = ~~selFilterType.options[selFilterType.selectedIndex].value;

	if (filterType === -1) {
		clear();
	}
}

selFilterType.addEventListener('change', setFilterType, false);


function resetCanvas() {
	canvas.width  = canvasWidth;
	canvas.height = canvasHeight;
	context.lineWidth = 1;
	context.strokeStyle = COLOR;
	context.font = "14px Arial";
	context.fillStyle = COLOR;
}
resetCanvas();

function draw(objArr, rateW, rateH, type) {
	let ctx = context;
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	let l = objArr.length;
	while (l--) {
		let obj = objArr[l];
		if ((type === 0) || (obj.type === type)) {
			let pos = obj.axis.split(':');
			//console.log(~~pos[2], ~~pos[0], ~~pos[3] - ~~pos[2], ~~pos[1] - ~~pos[0]);
			ctx.strokeRect(~~(~~pos[2] * rateW) + 0.5, ~~(~~pos[0] * rateH) + 0.5, ~~((~~pos[3] - ~~pos[2]) * rateW), ~~((~~pos[1] - ~~pos[0]) * rateH));
			ctx.fillText(unescape(obj.name.replace(/\\u/g, '%u')), ~~(~~pos[2] * rateW) + 0.5, Math.max(0, ~~(~~pos[0] * rateH - 6) + 0.5));
		}
	}
}

function clear() {
	context.clearRect(0, 0,  canvasWidth, canvasHeight);
}

function makeArr(duration, fps, faceHash) {
	let totalFramse = fps * duration;
	let arr = new Array(Math.ceil(totalFramse));
	for (key in faceHash) {
		let i = ~~key;
		arr[i] = faceHash[key];
	}
	return arr;
}

function main() {
	const video = document.getElementById('video');

	const player = plyr.setup(video , {
		iconUrl: './lib/player/plyr.svg',
		displayDuration: true,
		controls: ['play-large', 'play', 'progress', "current-time", "duration", "mute", "volume" , "fullscreen"],
		tooltips: {
			controls: false,
			seek: false
		}
	})[0] ;

	function resetCanvasSize(w , h){
		canvasWidth = w;
		canvasHeight = h;
		canvas.width  = canvasWidth;
		canvas.height = canvasHeight;
	}

	function resetSizeRate(){
		rateW = canvas.width / video.videoWidth;
		rateH = canvas.height / video.videoHeight;
	}


	player.on('enterfullscreen' , function () {
		let rectObject = video.getBoundingClientRect();
		console.log('ef' , rectObject);
		resetCanvasSize(rectObject.width , rectObject.height);
		resetSizeRate();
		resetCanvas();
	});

	player.on('exitfullscreen' , function () {
		let rectObject = video.getBoundingClientRect();
		console.log('xf' , rectObject);
		resetCanvasSize(rectObject.width , rectObject.height);
		resetSizeRate();
		resetCanvas();
	});

	video.addEventListener('canplay', function () {
		video.parentNode.insertBefore(canvas, video.nextSibling);
	});

	fetch('json/demo.json', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	}).then(res => {
		if (res.ok) {
			if (res.status === 200) {
				res.json().then(json => {

					console.log(json);


					const fps = parseInt(json.fps, 10);
					//const frameArr = makeArr(parseFloat(json.duration, 10), fps, json.face);
					const frameArr = json.face;
					video.addEventListener('timeupdate', function () {
						if (filterType !== -1) {
							let currentFrame = parseInt(video.currentTime * fps, 10);
							let currentObj = frameArr[currentFrame];
							//console.log(currentFrame, currentObj);
							if (currentObj) {
								//console.log(currentObj);
								draw(currentObj, rateW, rateH, filterType);
							}
							else {
								clear();
							}
						}
					}, false);

					video.addEventListener("loadedmetadata", function (e) {
						resetSizeRate();
					}, false);


				});


			}
		}
	}).catch((err) =>{
		throw new Error(err.message);
	});

}


main();
