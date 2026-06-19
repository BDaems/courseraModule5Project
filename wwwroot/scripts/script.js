const menuToggle = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
const projectFilters = document.querySelector('.project-filters');
const projectFiltersPanel = document.querySelector('.project-filter-options');
const projectArticles = document.querySelectorAll('#projects article');
const projectImages = document.querySelectorAll('#projects img[data-lightbox="project-image"]');
const projectLightbox = document.querySelector('#project-lightbox');
const projectLightboxImage = document.querySelector('.project-lightbox__image');
const projectLightboxCloseTargets = document.querySelectorAll('[data-lightbox-close]');
const contactForm = document.querySelector('#contact-form');
const contactFormStatus = document.querySelector('#contact-form-status');
const contactNameInput = document.querySelector('#contact-name');
const contactEmailInput = document.querySelector('#contact-email');
const contactMessageInput = document.querySelector('#contact-message');
let projectFilterCheckboxes = [];

if (menuToggle && siteNavigation) {
	menuToggle.addEventListener('click', () => {
		const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
		const nextState = !isExpanded;
		menuToggle.setAttribute('aria-expanded', String(nextState));
		menuToggle.classList.toggle('is-active', nextState);
		siteNavigation.classList.toggle('is-open');
	});
}

function getSelectedProjectCategories() {
	return Array.from(projectFilterCheckboxes)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.value);
}

function formatProjectCategoryLabel(category) {
	return category
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (character) => character.toUpperCase());
}

function getUniqueProjectCategories() {
	return Array.from(new Set(Array.from(projectArticles).map((article) => article.getAttribute('data-category')).filter(Boolean)));
}

function buildProjectFilterOptions() {
	if (!projectFiltersPanel) {
		return;
	}

	const categories = getUniqueProjectCategories();
	projectFiltersPanel.innerHTML = '';

	categories.forEach((category) => {
		const option = document.createElement('label');
		option.className = 'project-filter-option';
		option.addEventListener('click', (event) => {
			if (event.target.tagName !== 'INPUT') {
				event.preventDefault();
				const checkbox = option.querySelector('input');
				checkbox.checked = !checkbox.checked;
				filterProjects();
			}
		});

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'project-filter-checkbox';
		checkbox.value = category;
		checkbox.checked = true;

		const label = document.createElement('span');
		label.textContent = formatProjectCategoryLabel(category);

		option.appendChild(checkbox);
		option.appendChild(label);
		projectFiltersPanel.appendChild(option);
	});

	projectFilterCheckboxes = document.querySelectorAll('.project-filter-checkbox');
	projectFilterCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', () => {
			filterProjects();
		});
	});
}

function filterProjects(category) {
	if (Array.isArray(category)) {
		const normalizedCategories = new Set(category);
		projectFilterCheckboxes.forEach((checkbox) => {
			checkbox.checked = normalizedCategories.has(checkbox.value);
		});
	}

	const selectedCategories = getSelectedProjectCategories();
	const selectedCategorySet = new Set(selectedCategories);

	projectArticles.forEach((article) => {
		const projectCategory = article.dataset.category;
		const shouldShow = selectedCategorySet.has(projectCategory);
		article.style.display = shouldShow ? '' : 'none';
	});
}

function openProjectLightbox(image) {
	if (!projectLightbox || !projectLightboxImage || !image) {
		return;
	}

	projectLightboxImage.src = image.src;
	projectLightboxImage.alt = image.alt || '';
	projectLightbox.classList.add('is-open');
	projectLightbox.setAttribute('aria-hidden', 'false');
	document.body.classList.add('has-open-lightbox');
}

function closeProjectLightbox() {
	if (!projectLightbox || !projectLightboxImage) {
		return;
	}

	projectLightbox.classList.remove('is-open');
	projectLightbox.setAttribute('aria-hidden', 'true');
	projectLightboxImage.src = '';
	projectLightboxImage.alt = '';
	document.body.classList.remove('has-open-lightbox');
}

function buildProjectLightbox() {
	projectImages.forEach((image) => {
		image.style.cursor = 'zoom-in';
		image.addEventListener('click', () => {
			openProjectLightbox(image);
		});
	});

	projectLightboxCloseTargets.forEach((target) => {
		target.addEventListener('click', closeProjectLightbox);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeProjectLightbox();
		}
	});
}

function setContactFormMessage(message, isError) {
	if (!contactFormStatus) {
		return;
	}

	contactFormStatus.textContent = message;
	contactFormStatus.classList.toggle('is-error', isError);
	contactFormStatus.classList.toggle('is-success', !isError && Boolean(message));
}

function clearContactFieldState(field) {
	field.classList.remove('is-invalid');
	field.removeAttribute('aria-invalid');
}

function validateContactForm() {
	if (!contactForm || !contactNameInput || !contactEmailInput || !contactMessageInput) {
		return true;
	}

	const nameValue = contactNameInput.value.trim();
	const emailValue = contactEmailInput.value.trim();
	const messageValue = contactMessageInput.value.trim();

	[contactNameInput, contactEmailInput, contactMessageInput].forEach(clearContactFieldState);

	if (!nameValue || !emailValue || !messageValue) {
		if (!nameValue) {
			contactNameInput.classList.add('is-invalid');
			contactNameInput.setAttribute('aria-invalid', 'true');
            const nameError = document.getElementById('contactNameError');
            nameError.textContent = 'Please enter your name.';		}

		if (!emailValue) {
			contactEmailInput.classList.add('is-invalid');
			contactEmailInput.setAttribute('aria-invalid', 'true');
            const emailError = document.getElementById('contactEmailError');
            emailError.textContent = 'Please enter a valid email address.';		}

		if (!messageValue) {
			contactMessageInput.classList.add('is-invalid');
			contactMessageInput.setAttribute('aria-invalid', 'true');
            const messageError = document.getElementById('contactMessageError');
            messageError.textContent = 'Please enter a message.';		}

		setContactFormMessage('Please complete your name, email, and message before submitting.', true);
		return false;
	}

	setContactFormMessage('Thanks. Your message is ready to be sent.', false);
	return true;
}

buildProjectFilterOptions();
buildProjectLightbox();

if (contactForm) {
	contactForm.addEventListener('submit', (event) => {
		if (!validateContactForm()) {
			event.preventDefault();
		}
	});

	[contactNameInput, contactEmailInput, contactMessageInput].forEach((field) => {
		if (!field) {
			return;
		}

		field.addEventListener('input', () => {
			if (field.value.trim()) {
				clearContactFieldState(field);
			}
		});
	});
}

if (projectFilters) {
	document.addEventListener('click', (event) => {
		if (projectFilters.hasAttribute('open') && !projectFilters.contains(event.target)) {
			projectFilters.removeAttribute('open');
		}
	});
}

filterProjects();

window.filterProjects = filterProjects;
window.openProjectLightbox = openProjectLightbox;
window.closeProjectLightbox = closeProjectLightbox;
