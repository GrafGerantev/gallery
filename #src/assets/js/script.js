const galleryInner = document.querySelector('.gallery__inner');
const input = document.querySelector('.form__input');
const btnLoad = document.querySelector('.btn-load');
const btnDel = document.querySelector('.btn-del');
const galleryForm = document.querySelector('.gallery-form');
const drag = ['dragenter', 'dragover', 'dragleave', 'drop'];
const dragEO = ['dragenter', 'dragover'];
const dragLD = ['dragenter', 'dragover'];
let arr = [];
let local;


function showGallery() {
	const spiner = document.createElement('div');
	const galleryItem = document.createElement('div');
	galleryItem.classList.add('gallery-item');
	spiner.classList.add('spiner');
	galleryInner.appendChild(spiner);


	fetch('https://don16obqbay2c.cloudfront.net/frontend-test-task/gallery-images.json')
		.then(response => response.json())
		.then(json => {
			for (key in json) {
				/* console.log(json[key]); */
				for (elem in json[key]) {
					const galleryItem = document.createElement('div');
					const galleryImg = document.createElement('img');
					const galleryPlace = document.createElement('img');
					galleryItem.classList.add('gallery-item');
					galleryPlace.classList.add('gallery-item__placeholder');
					galleryPlace.src = "http://placehold.it/180x135/2ecc71/ecf0f1";
					galleryPlace.onload = () => {
						spiner.style.display = 'none';
					}
					//console.log(json[key][elem]);
					//console.log(json[key][elem].url);

					galleryItem.appendChild(galleryPlace);
					galleryImg.classList.add('gallery-item__img');
					galleryItem.appendChild(galleryImg);

					galleryImg.onload = () => {
						/* galleryImg.style.opacity = 1; */
						galleryPlace.style.display = "none";
					}

					galleryImg.src = json[key][elem].url;
					galleryInner.appendChild(galleryItem);

				}
				localGet();
			}
		});

}


function localGet() {
	local = localStorage.getItem('arr');
	local = JSON.parse(local);

	if (local != null) {
		for (let i = 0; i < local.length; i++) {
			console.log(local[i]);

			const galleryItem = document.createElement('div');
			const galleryImg = document.createElement('img');

			galleryItem.classList.add('gallery-item');
			galleryImg.classList.add('gallery-item__img');
			galleryItem.appendChild(galleryImg);
			galleryImg.src = local[i];
			galleryInner.appendChild(galleryItem);
			arr.push(local[i]);
		}
	}

}


function addImg() {
	const galleryItem = document.createElement('div');
	const galleryImg = document.createElement('img');


	if (input.value != '') {
		galleryImg.src = input.value;
		const galleryPlace = document.createElement('img');
		galleryItem.classList.add('gallery-item');
		galleryPlace.classList.add('gallery-item__placeholder');
		galleryPlace.src = "assets/images/8.jpg";
		galleryItem.appendChild(galleryPlace);
		galleryImg.onload = function () {
			galleryPlace.style.display = "none";
			galleryItem.classList.add('gallery-item');
			galleryImg.classList.add('gallery-item__img');
			galleryItem.appendChild(galleryImg);

			galleryInner.appendChild(galleryItem);
			arr.push(input.value);
			localSet();
			input.value = '';
		}
		galleryImg.onerror = function () {
			const formError = document.querySelector('.form-error');
			formError.innerHTML = 'Вставьте корректную ссылку на изображение!';

		}

	} else {
		const formError = document.querySelector('.form-error');
		formError.innerHTML = 'Вставьте ссылку на изображение!';
		//console.log(formError);
	}

}

function localSet() {
	localStorage.setItem('arr', JSON.stringify(arr));
	//console.log(arr);
}

function selectImg(event) {

	let e = event.target;
	/* console.log(galleryInner); */

	if (e != galleryInner) {
		if (e.parentNode.classList.contains('active')) {
			e.parentNode.classList.remove('active');
		} else {
			e.parentNode.classList.add('active');
		}
	}
}


function removeImg() {
	const selectItem = galleryInner.childNodes;
	/* console.log(selectItem); */
	for (let i = 1; i < selectItem.length; i++) {
		if (selectItem[i].classList.contains('active')) {
			/* selectItem[i].remove(); */
			/* 			const img = selectItem[i].querySelector('img');
						console.log(img);

						if (img) {
							let currentLS = localStorage.getItem('arr', arr);
							currentLS = JSON.parse(currentLS);
							console.log(currentLS);
							if (currentLS.includes(img.src)) {
								localStorage.setItem('arr', JSON.stringify(currentLS.filter((item) => {
									return item !== img.src;
								})));
							}
						} */
			selectItem[i].remove();
		}

	}
}

function clearLS() {
	localStorage.clear();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	galleryForm.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
	galleryForm.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
	galleryForm.addEventListener(eventName, unhighlight, false)
});



function highlight(e) {
	galleryForm.classList.add('bordercolor');
}

function unhighlight(e) {
	galleryForm.classList.remove('bordercolor');
}


function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

galleryForm.addEventListener('drop', handlerDrop, false);

function handlerDrop(e) {
	let dt = e.dataTransfer;
	let files = dt.files;
	handleFiles(files);
}

function handleFiles(files) {
	files = [...files]
	/* files.forEach(uploadFile) */
	files.forEach(previewFile)
}

function previewFile(file) {
	let reader = new FileReader();
	console.log(reader);
	reader.readAsDataURL(file);
	reader.onloadend = function () {
		const galleryItem = document.createElement('div');
		const galleryImg = document.createElement('img');
		galleryItem.classList.add('gallery-item');
		galleryImg.classList.add('gallery-item__img');
		galleryImg.src = reader.result;
		galleryItem.appendChild(galleryImg);
		galleryInner.appendChild(galleryItem);

	}
}

clearLS();
showGallery();
btnLoad.addEventListener('click', addImg);
galleryInner.addEventListener('click', selectImg, false);
btnDel.addEventListener('click', removeImg);