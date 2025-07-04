// burger-menu
const burgerMenu = document.querySelector('.burger-menu');
burgerMenu.addEventListener('click', (e) => {
	burgerMenu.classList.toggle('_active');
	document.querySelector('.header-menu').classList.toggle('_active');
	document.body.classList.toggle('_lock');
});


// open fiter on mobile in inventory page
const filterOpenButton = document.querySelector('[data-open-filter]'),
	filter = document.querySelector('[data-filter]'),
	filterCloseButton = document.querySelector('[data-close-filter]');

if (filterOpenButton) {


	filterOpenButton.addEventListener('click', openFilter)

	window.addEventListener('click', closeFilter)
	function openFilter(e) {
		filter.classList.add('_active');
		document.body.classList.add('_lock')
	}
	function closeFilter(e) {
		const target = e.target
		if (!target.closest('.body-products-aside__wrapper') && target !== filterOpenButton) {
			filter.classList.remove('_active');
			document.body.classList.remove('_lock')
		} else if (target === filterCloseButton) {
			filter.classList.remove('_active');
			document.body.classList.remove('_lock')
		}
	}
}


//  set html tag atribute "mobile-mode" on screens < 991.98px
let mql = window.matchMedia("(max-width: 991.98px)");
window.addEventListener('resize', mobileModeFunction)

function mobileModeFunction() {
	if (mql.matches) {
		document.documentElement.dataset.mobileMode = true
	} else {
		document.documentElement.dataset.mobileMode = false
	}
}

mobileModeFunction()

// open/close menu on mobile
const menuLinks = document.querySelectorAll('[data-with-submenu]');

if (menuLinks) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onClickToLink)

		function onClickToLink(e) {
			e.preventDefault()
			if (document.documentElement.dataset.mobileMode === 'true') {
				const menuContent = menuLink.nextElementSibling;
				menuLink.classList.toggle('_active')
				_slideToggle(menuContent)
			}


			function _slideUp(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = target.offsetHeight + 'px';
					target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					window.setTimeout(() => {
						target.style.display = 'none';
						target.style.removeProperty('height');
						target.style.removeProperty('padding-top');
						target.style.removeProperty('padding-bottom');
						target.style.removeProperty('margin-top');
						target.style.removeProperty('margin-bottom');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}
			}

			function _slideDown(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.removeProperty('display');
					let display = window.getComputedStyle(target).display;
					if (display === 'none')
						display = 'block'

					target.style.display = display;
					let height = target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					target.offsetHeight;
					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = height + 'px';
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					window.setTimeout(() => {
						target.style.removeProperty('height');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}

			}

			function _slideToggle(target, duration = 500) {
				if (window.getComputedStyle(target).display === 'none') {
					return _slideDown(target, duration);
				} else {
					_slideUp(target, duration);
				}
			}
		}

	});


}

// A function that moves elements to other blocks depending on the size of the screen. (Used when adapting the page to different devices.)
function dynamicAdaptiv() {
	class DynamicAdapt {
		constructor(type) {
			this.type = type
		}

		init() {
			// массив объектов
			this.оbjects = []
			this.daClassname = '_dynamic_adapt_'
			// массив DOM-элементов
			this.nodes = [...document.querySelectorAll('[data-da]')]

			// наполнение оbjects обьектами
			this.nodes.forEach((node) => {
				const data = node.dataset.da.trim()
				const dataArray = data.split(',')
				const оbject = {}
				оbject.element = node
				оbject.parent = node.parentNode
				оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
				оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
				оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
				оbject.index = this.indexInParent(оbject.parent, оbject.element)
				this.оbjects.push(оbject)
			})
			this.arraySort(this.оbjects)

			// массив уникальных медиа-запросов
			this.mediaQueries = this.оbjects
				.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
				.filter((item, index, self) => self.indexOf(item) === index)
			// навешивание слушателя на медиа-запрос
			// и вызов обработчика при первом запуске
			this.mediaQueries.forEach((media) => {
				const mediaSplit = media.split(',')
				const matchMedia = window.matchMedia(mediaSplit[0])
				const mediaBreakpoint = mediaSplit[1]

				// массив объектов с подходящим брейкпоинтом
				const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
				matchMedia.addEventListener('change', () => {

					this.mediaHandler(matchMedia, оbjectsFilter)
				})
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
		}

		// Основная функция
		mediaHandler(matchMedia, оbjects) {
			if (matchMedia.matches) {
				оbjects.forEach((оbject) => {
					// оbject.index = this.indexInParent(оbject.parent, оbject.element);
					this.moveTo(оbject.place, оbject.element, оbject.destination)
				})
			} else {
				оbjects.forEach(({ parent, element, index }) => {
					if (element.classList.contains(this.daClassname)) {
						this.moveBack(parent, element, index)
					}
				})
			}
		}

		// Функция перемещения
		moveTo(place, element, destination) {
			element.classList.add(this.daClassname)
			if (place === 'last' || place >= destination.children.length) {
				destination.append(element)
				return
			}
			if (place === 'first') {
				destination.prepend(element)
				return
			}
			destination.children[place].before(element)
		}

		// Функция возврата
		moveBack(parent, element, index) {
			element.classList.remove(this.daClassname)
			if (parent.children[index] !== undefined) {
				parent.children[index].before(element)
			} else {
				parent.append(element)
			}
		}

		// Функция получения индекса внутри родителя
		indexInParent(parent, element) {
			return [...parent.children].indexOf(element)
		}

		// Функция сортировки массива по breakpoint и place
		// по возрастанию для this.type = min
		// по убыванию для this.type = max
		arraySort(arr) {
			if (this.type === 'min') {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return -1
						}
						if (a.place === 'last' || b.place === 'first') {
							return 1
						}
						return 0
					}
					return a.breakpoint - b.breakpoint
				})
			} else {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return 1
						}
						if (a.place === 'last' || b.place === 'first') {
							return -1
						}
						return 0
					}
					return b.breakpoint - a.breakpoint
				})
				return
			}
		}
	}

	let da = new DynamicAdapt('max');
	da.init();
}

dynamicAdaptiv()

// dropdown Menu function
function selectMenu() {
	const selects = document.querySelectorAll('[data-select-menu]');

	// data-select-menu main data-atribute
	// data-select-menu-button open close dropdown menu
	// data-select-menu-value value of data-select-menu-button
	// data-select-menu-drop-down body of dropdown menu
	// data-select-menu-option options of dropdown menu

	if (selects) {

		document.documentElement.addEventListener('click', collapseSelects)

		selects.forEach(select => {

			const selectButton = select.querySelector('[data-select-menu-button]');
			const selectOptions = select.querySelectorAll('[data-select-menu-option]');

			selectButton.addEventListener('click', selectToggle)
			selectOptions.forEach(el => {
				el.addEventListener('click', selectChoose)
			});
		});



		function selectToggle(e) {
			const parent = e.target.closest('[data-select-menu]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]');
			parent.classList.toggle('_active')
			_slideToggle(selectBody, 300)
		}

		function selectChoose(e) {
			const parent = e.target.closest('[data-select-menu]'),
				selectValue = parent.querySelector('[data-select-menu-value]'),
				selectBody = parent.querySelector('[data-select-menu-drop-down]');
			
			if (parent.classList.contains('_first-choice')) {
				parent.classList.remove('_first-choice')
			}
			
			let valueItem = this.innerText;
			selectValue.innerHTML = valueItem;
			parent.classList.remove('_active')
			_slideUp(selectBody, 300)
		}

		function collapseSelects(e) {
			const targetClick = e.target.closest('[data-select-menu]')
			
			selects.forEach(select => {
				if (!targetClick || targetClick !== select) {
					select.classList.remove('_active')
					const selectBody = select.querySelector('[data-select-menu-drop-down]');
					_slideUp(selectBody, 300)
				}
			});

		}

		let _slideUp = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = target.offsetHeight + 'px';
				target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				window.setTimeout(() => {
					target.style.display = 'none';
					target.style.removeProperty('height');
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}
		}

		let _slideDown = (target, duration = 500) => {
			if (!target.classList.contains('_slide')) {
				target.classList.add('_slide');

				target.style.removeProperty('display');
				let display = window.getComputedStyle(target).display;
				if (display === 'none')
					display = 'block'

				target.style.display = display;
				let height = target.offsetHeight;
				target.style.overflow = 'hidden';
				target.style.height = 0;
				target.style.paddingTop = 0;
				target.style.paddingBottom = 0;
				target.style.marginTop = 0;
				target.style.marginBottom = 0;
				target.offsetHeight;
				target.style.transitionProperty = 'height, margin, padding';
				target.style.transitionDuration = duration + 'ms';
				target.style.height = height + 'px';
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				window.setTimeout(() => {
					target.style.removeProperty('height');
					target.style.removeProperty('overflow');
					target.style.removeProperty('transition-duration');
					target.style.removeProperty('transition-property');
					target.classList.remove('_slide');
				}, duration);
			}

		}

		let _slideToggle = (target, duration = 500) => {
			if (window.getComputedStyle(target).display === 'none') {
				return _slideDown(target, duration);
			} else {
				_slideUp(target, duration);
			}
		}
	}


}

selectMenu()

// filter function

function filterFunction() {
	const filters = document.querySelectorAll('[data-filter]');

	if (filters) {
		filters.forEach(filter => {
			const filterButtons = filter.querySelectorAll('[data-filter-category]'),
				filterSections = filter.querySelectorAll('[data-filter-content]')

			filterButtons.forEach(filterButton => {

				filterButton.addEventListener('click', (e) => {

					filterSections.forEach(filterSection => {
						if (filterSection.classList.contains('_show')) {
							filterSection.classList.remove('_show')
						}
						if (filterSection.classList.contains('_last-child')) {
							filterSection.classList.remove('_last-child')
						}

					});

					filterButtons.forEach(filterButton => {
						if (filterButton.classList.contains('_active')) {
							filterButton.classList.remove('_active')
						}
					});

					let seflButton = e.target,
						buttonId = seflButton.dataset.filterCategory

					if (buttonId === 'all') {
						filterSections.forEach((filterSection, index) => {
							filterSection.classList.add('_show')

						});

					} else {
						filterSections.forEach(filterSection => {
							let contentCategories = filterSection.dataset.filterContent.split(',')
							if (contentCategories.includes(buttonId)) {
								filterSection.classList.add('_show')
							}

						});

					}

					seflButton.classList.add('_active')

				})
			});


		});
	}

}

filterFunction()

// home-page swiper with reviews

const swiperReviewsWrapper = document.querySelector('.content-reviews__swiper');

let reviewsSwiper;

try {
	reviewsSwiper = new Swiper(swiperReviewsWrapper, {
		slidesPerView: 'auto',
		spaceBetween: 20,
		rewind: true,
		navigation: {
			nextEl: '.reviews__arrow-next',
			prevEl: '.reviews__arrow-prev',
		},
	});
}
catch (e) {

}





// spollers function

function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(',')[0];
		});

		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}
	}

	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(',')[0];
	});



	if (spollersMedia.length > 0) {

		const breakpoinsArray = [];
		spollersMedia.forEach((item) => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(',');
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
			breakpoint.item = item;
			breakpoinsArray.push(breakpoint);
		});

		let mediaQueries = breakpoinsArray.map((item) => {
			return '(' + item.type + "-width: " + item.value + 'px),' + item.value + ',' + item.type;
		});

		mediaQueries = mediaQueries.filter((item, index, self) => {
			return self.indexOf(item) === index;
		});

		mediaQueries.forEach((breakpoint) => {
			const paramsArray = breakpoint.split(',');
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spollersArray = breakpoinsArray.filter((item) => {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			matchMedia.addEventListener("change", function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}

	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach((spollersBlock) => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click', setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction)
			}
		});
	}

	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			})
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollerBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();

		}
	}

	function hideSpollerBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}


	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);

		}
	}

	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);

		}
	}

	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			_slideUp(target, duration);
		}
	}
}

spollers()

// product slider
const productsSlider = document.getElementById('products-range-slider');

if (productsSlider) {
	const minInput = document.querySelector('#producs-price-min-input'),
		maxInput = document.querySelector('#producs-price-max-input')
	let maxValue = +productsSlider.dataset.maxValue,
		minValue = +productsSlider.dataset.minValue
	noUiSlider.create(productsSlider, {
		start: [13200, 32000],
		connect: true,
		range: {
			'min': minValue,
			'max': maxValue
		}
	});

	productsSlider.noUiSlider.on('update', function (values, handle) {

		let value = +values[handle];
		let fixedValue = +value.toFixed();
		let valueWithSeparator = fixedValue.toLocaleString('en-US')
		let valueWithSign = '$' + valueWithSeparator

		if (handle) {
			maxInput.value = valueWithSign;
		} else {
			minInput.value = valueWithSign;

		}
	});



	minInput.addEventListener('change', function () {
		productsSlider.noUiSlider.set([this.value, null]);
	});

	maxInput.addEventListener('change', function () {
		productsSlider.noUiSlider.set([null, this.value]);
	});
}




// only number in input
function onlyNumb() {
	const inputs = document.querySelectorAll('[data-input-numb]');
	if (inputs) {
		inputs.forEach(input => {
			input.setAttribute('inputmode', 'numeric');
			input.addEventListener('input', (e) => {
				let value = e.target.value;
				e.target.value = value.replace(/\D/g, '')
			})
		})

	}
}

onlyNumb()


// show more button

const showMoreWrappers = document.querySelectorAll('[data-show-more]');

if (showMoreWrappers) {
	showMoreWrappers.forEach(showMoreWrapper => {
		const showMoreContent = showMoreWrapper.querySelector('[data-show-more-content]'),
			showMorebutton = showMoreWrapper.querySelector('[data-show-more-button]');

		showMorebutton.addEventListener('click', (e) => {
			showMoreContent.classList.add('_show-all')
			showMorebutton.classList.add('_hide')
		})
	});
}

// copy button

const copyWrappers = document.querySelectorAll('[data-copy]');

if (copyWrappers) {
	copyWrappers.forEach(copyWrapper => {
		const copyText = copyWrapper.querySelector('[data-copy-text]'),
			copyButton = copyWrapper.querySelector('[data-copy-button]'),
			copyMessage = copyWrapper.querySelector('[data-copy-message]')

		copyButton.addEventListener('click', copyingText)

		function copyingText() {
			let copiedText = copyText.innerHTML
			navigator.clipboard.writeText(copiedText)

			copyMessage.classList.add('_show')

			setTimeout(() => {
				copyMessage.classList.remove('_show')
			}, 3000);
		}


	});
}

// single page gallery

const galleryWrapper = document.getElementById('product-gallery');

if (galleryWrapper) {
	lightGallery(galleryWrapper, {
		speed: 500,
		download: false,
		getCaptionFromTitleOrAlt: false,
		hideScrollbar: true,
		selector: '[data-gallery-wrapper]',
		mobileSettings: {
			controls: false,
			showCloseIcon: true,
			download: false,
		},
		preload: 4,
	});
}

