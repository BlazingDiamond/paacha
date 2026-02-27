// Translation data
const translations = {
	en: {
		nav: {
			home: 'Home',
			tours: 'Tours',
			contact: 'Contact',
			about: 'About',
			bookNow: 'Book Now'
		},
		contact: {
			title: 'Choose Your Next<br>Adventure',
			hours: 'Monday–Friday, 9am – 5pm (CAT)',
			form: {
				name: 'Name',
				namePlaceholder: 'Name',
				email: 'Email',
				emailPlaceholder: 'Email',
				subject: 'Subject',
				subjectPlaceholder: 'Subject',
				message: 'Message',
				messagePlaceholder: 'Message',
				submit: 'SUBMIT'
			}
		},
		home: {
			hero: {
				welcome: 'Welcome to Pacha Tours and Travel',
				title: 'From Cape Town\'s Shores to<br>Johannesburg\'s Horizons',
				description: 'Across the rugged peaks of Lesotho and the lush valleys of Eswatini — Southern Africa calls.',
				cta: 'Start Your Adventure'
			},
			whyTravel: {
				title: 'Why Travel with<br>Pacha Tours<br>and Travel?',
				description: 'We\'re more than a travel company — we\'re your local guide to the heart of Africa. With decades of expertise, we craft authentic, safe, and unforgettable travel experiences tailored just for you.',
				learnMore: 'Learn More'
			},
			features: {
				expertise: {
					title: 'Expertise You Can Trust',
					description: 'Deep roots across Africa. Our guides bring insider knowledge you won\'t find anywhere else.'
				},
				tailored: {
					title: 'Tailored Itineraries',
					description: 'We craft each journey to match your interests, pace, and dream destinations.'
				},
				seamless: {
					title: 'Seamless & Safe',
					description: 'We handle every detail—transport, hotels, and logistics—so you explore with peace of mind.'
				}
			},
			gallery: {
				title: 'Moments That Stay With You',
				subtitle: 'Memories from our latest travelers across the continent.'
			},
			testimonials: {
				title: 'Real Stories from Real Adventures'
			},
			cta: {
				title: 'Start Your Journey Today',
				description: 'Your unforgettable journey starts here. Let us craft your perfect adventure.',
				button: 'Get Free Quote'
			}
		},
		footer: {
			description: 'Crafting unforgettable experiences across Southern Africa since 2010. Your safety and joy are our priority.',
			links: 'Links',
			contact: 'Contact',
			tours: 'Tours',
			blog: 'Blog',
			terms: 'Terms of Service',
			privacy: 'Privacy Policy',
			copyright: '© 2026 Pacha Tours and Travel. All rights reserved.'
		}
	},
	fr: {
		nav: {
			home: 'Accueil',
			tours: 'Circuits',
			contact: 'Contact',
			about: 'À Propos',
			bookNow: 'Réserver'
		},
		contact: {
			title: 'Choisissez Votre<br>Prochaine Aventure',
			hours: 'Lundi–Vendredi, 9h – 17h (CAT)',
			form: {
				name: 'Nom',
				namePlaceholder: 'Nom',
				email: 'E-mail',
				emailPlaceholder: 'E-mail',
				subject: 'Sujet',
				subjectPlaceholder: 'Sujet',
				message: 'Message',
				messagePlaceholder: 'Message',
				submit: 'ENVOYER'
			}
		},
		home: {
			hero: {
				welcome: 'Bienvenue chez Pacha Tours and Travel',
				title: 'Des Rivages du Cap aux<br>Horizons de Johannesburg',
				description: 'À travers les pics escarpés du Lesotho et les vallées luxuriantes d\'Eswatini — l\'Afrique Australe vous appelle.',
				cta: 'Commencez Votre Aventure'
			},
			whyTravel: {
				title: 'Pourquoi Voyager avec<br>Pacha Tours<br>and Travel?',
				description: 'Nous sommes plus qu\'une agence de voyages — nous sommes votre guide local au cœur de l\'Afrique. Avec des décennies d\'expertise, nous créons des expériences de voyage authentiques, sûres et inoubliables, adaptées à vos besoins.',
				learnMore: 'En Savoir Plus'
			},
			features: {
				expertise: {
					title: 'Expertise de Confiance',
					description: 'Racines profondes à travers l\'Afrique. Nos guides apportent des connaissances d\'initiés que vous ne trouverez nulle part ailleurs.'
				},
				tailored: {
					title: 'Itinéraires Sur Mesure',
					description: 'Nous créons chaque voyage en fonction de vos intérêts, de votre rythme et de vos destinations de rêve.'
				},
				seamless: {
					title: 'Sans Souci et Sécurisé',
					description: 'Nous gérons chaque détail — transport, hôtels et logistique — pour que vous puissiez explorer en toute tranquillité.'
				}
			},
			gallery: {
				title: 'Moments Qui Restent',
				subtitle: 'Souvenirs de nos derniers voyageurs à travers le continent.'
			},
			testimonials: {
				title: 'Histoires Réelles d\'Aventures Réelles'
			},
			cta: {
				title: 'Commencez Votre Voyage Aujourd\'hui',
				description: 'Votre voyage inoubliable commence ici. Laissez-nous créer votre aventure parfaite.',
				button: 'Obtenir Un Devis Gratuit'
			}
		},
		footer: {
			description: 'Créer des expériences inoubliables à travers l\'Afrique Australe depuis 2010. Votre sécurité et votre joie sont notre priorité.',
			links: 'Liens',
			contact: 'Contact',
			tours: 'Circuits',
			blog: 'Blog',
			terms: 'Conditions d\'Utilisation',
			privacy: 'Politique de Confidentialité',
			copyright: '© 2026 Pacha Tours and Travel. Tous droits réservés.'
		}
	}
};

// Language management
let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
	currentLanguage = lang;
	localStorage.setItem('language', lang);
	document.documentElement.lang = lang;
	translatePage();
	updateLanguageButtons();
}

function translatePage() {
	// Translate all elements with data-i18n attribute
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		const translation = getNestedTranslation(translations[currentLanguage], key);
		if (translation) {
			element.innerHTML = translation;
		}
	});

	// Translate placeholders
	document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
		const key = element.getAttribute('data-i18n-placeholder');
		const translation = getNestedTranslation(translations[currentLanguage], key);
		if (translation) {
			element.placeholder = translation;
		}
	});
}

function getNestedTranslation(obj, path) {
	return path.split('.').reduce((current, key) => current?.[key], obj);
}

function updateLanguageButtons() {
	// Desktop buttons
	const enBtn = document.getElementById('lang-en');
	const frBtn = document.getElementById('lang-fr');
	
	// Mobile buttons
	const enBtnMobile = document.getElementById('lang-en-mobile');
	const frBtnMobile = document.getElementById('lang-fr-mobile');
	
	if (currentLanguage === 'en') {
		// Desktop
		if (enBtn && frBtn) {
			enBtn.classList.add('bg-primary', 'text-white');
			enBtn.classList.remove('bg-gray-100', 'text-gray-700');
			frBtn.classList.remove('bg-primary', 'text-white');
			frBtn.classList.add('bg-gray-100', 'text-gray-700');
		}
		// Mobile
		if (enBtnMobile && frBtnMobile) {
			enBtnMobile.classList.add('bg-primary', 'text-white');
			enBtnMobile.classList.remove('bg-gray-100', 'text-gray-700');
			frBtnMobile.classList.remove('bg-primary', 'text-white');
			frBtnMobile.classList.add('bg-gray-100', 'text-gray-700');
		}
	} else {
		// Desktop
		if (enBtn && frBtn) {
			frBtn.classList.add('bg-primary', 'text-white');
			frBtn.classList.remove('bg-gray-100', 'text-gray-700');
			enBtn.classList.remove('bg-primary', 'text-white');
			enBtn.classList.add('bg-gray-100', 'text-gray-700');
		}
		// Mobile
		if (enBtnMobile && frBtnMobile) {
			frBtnMobile.classList.add('bg-primary', 'text-white');
			frBtnMobile.classList.remove('bg-gray-100', 'text-gray-700');
			enBtnMobile.classList.remove('bg-primary', 'text-white');
			enBtnMobile.classList.add('bg-gray-100', 'text-gray-700');
		}
	}
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	translatePage();
	updateLanguageButtons();
});
