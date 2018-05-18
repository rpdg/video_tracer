//const $container = $('#playerContainer');
const video = document.getElementById('video');
const canvas = $('<canvas id="canvas"></canvas>')[0];

let selFilterType = document.getElementById('selFilter');
let filterType = 0;

function setFilterType() {
	filterType = ~~selFilterType.options[selFilterType.selectedIndex].value;

	if(filterType===-1){
		clear();
	}
}

selFilterType.addEventListener('change', setFilterType, false);


function draw(objArr, rateW, rateH, type) {
	const color = 'red';
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;

	let l = objArr.length;
	while (l--) {
		let obj = objArr[l];
		if ((type === 0) || (obj.type === type)) {
			let pos = obj.axis.split(':');
			//console.log(~~pos[2], ~~pos[0], ~~pos[3] - ~~pos[2], ~~pos[1] - ~~pos[0]);
			ctx.strokeRect(~~(~~pos[2] * rateW), ~~(~~pos[0] * rateH), ~~((~~pos[3] - ~~pos[2]) * rateW), ~~((~~pos[1] - ~~pos[0]) * rateH));


			ctx.font = "9px Arial";
			ctx.fillStyle = color;
			ctx.fillText(unescape(obj.name.replace(/\\u/g, '%u')), ~~(~~pos[2] * rateW), Math.max(0, ~~(~~pos[0] * rateH - 3)));
		}
	}
}

function clear() {
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
	plyr.setup('#video', {
		iconUrl: './lib/player/plyr.svg',
		displayDuration: true,
		controls: ['play-large', 'play', 'progress', "current-time", "duration", "mute", "volume"],//'fast-forward',
		tooltips: {
			controls: false,
			seek: false
		}
	});

	video.addEventListener('canplay', function () {
		$(this).after(canvas);
	});


	$.getJSON('json/demo.json', json => {
		let rateW = 0;
		let rateH = 0;

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
			rateW = canvas.width / this.videoWidth;
			rateH = canvas.height / this.videoHeight;
		}, false);
	});
}


main();
