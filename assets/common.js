// Header and Footer HTML Templates
const headerHTML = (activePage = '') => `
<header class="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
		<a href="index.html" class="font-bold text-2xl text-primary tracking-tight hover:scale-105 transition-transform cursor-pointer">
			PACHA TOURS
		</a>

		<nav class="hidden md:flex items-center space-x-8 font-medium text-gray-600">
			<a href="index.html" class="hover:text-primary py-2 transition-colors ${activePage === 'home' ? 'text-primary' : ''}" data-i18n="nav.home">Home</a>
			<a href="Contact.html" class="hover:text-primary py-2 transition-colors ${activePage === 'contact' ? 'text-primary' : ''}" data-i18n="nav.contact">Contact</a>
			<a href="Tours.html" class="hover:text-primary py-2 transition-colors ${activePage === 'tours' ? 'text-primary' : ''}" data-i18n="nav.tours">Tours</a>
			<a href="about.html" class="hover:text-primary py-2 transition-colors ${activePage === 'about' ? 'text-primary' : ''}" data-i18n="nav.about">About</a>
		</nav>

		<div class="hidden md:flex items-center gap-4">
			<!-- Language Switcher -->
			<div class="flex items-center gap-2 bg-gray-100 rounded-full p-1">
				<button id="lang-en" onclick="setLanguage('en')" class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all">
					EN
				</button>
				<button id="lang-fr" onclick="setLanguage('fr')" class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all">
					FR
				</button>
			</div>

			<a href="book-now.html" class="bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 hover:shadow-lg transition-all transform hover:scale-105" data-i18n="nav.bookNow">
				Book Now
			</a>
		</div>

		<button id="mobile-menu-btn" class="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 hover:bg-white/95 rounded-lg transition-colors ">
			<span class="hamburger-line block w-6 h-0.5 bg-gray-700"></span>
			<span class="hamburger-line block w-6 h-0.5 bg-gray-700"></span>
			<span class="hamburger-line block w-6 h-0.5 bg-gray-700"></span>
		</button>
	</div>

	<div id="mobile-menu" class="mobile-menu md:hidden bg-white border-t border-gray-100 shadow-lg">
		<nav class="px-4 py-6 space-y-4">
			<a href="index.html" class="block text-gray-700 hover:text-primary hover:bg-gray-50 font-medium text-base transition-all py-3 px-4 rounded-lg ${activePage === 'home' ? 'text-primary bg-gray-50' : ''}" data-i18n="nav.home">Home</a>
			<a href="Tours.html" class="block text-gray-700 hover:text-primary hover:bg-gray-50 font-medium text-base transition-all py-3 px-4 rounded-lg ${activePage === 'tours' ? 'text-primary bg-gray-50' : ''}" data-i18n="nav.tours">Tours</a>
			<a href="Contact.html" class="block text-gray-700 hover:text-primary hover:bg-gray-50 font-medium text-base transition-all py-3 px-4 rounded-lg ${activePage === 'contact' ? 'text-primary bg-gray-50' : ''}" data-i18n="nav.contact">Contact</a>
			<a href="about.html" class="block text-gray-700 hover:text-primary hover:bg-gray-50 font-medium text-base transition-all py-3 px-4 rounded-lg ${activePage === 'about' ? 'text-primary bg-gray-50' : ''}" data-i18n="nav.about">About</a>
			
			<!-- Mobile Language Switcher -->
			<div class="pt-4 flex gap-3">
				<button id="lang-en-mobile" onclick="setLanguage('en')" class="flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all">
					English
				</button>
				<button id="lang-fr-mobile" onclick="setLanguage('fr')" class="flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all">
					Français
				</button>
			</div>

			<div class="pt-2">
				<a href="book-now.html" class="block w-full bg-primary text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-primary/90 transition-all shadow-md text-center" data-i18n="nav.bookNow">
					Book Now
				</a>
			</div>
		</nav>
	</div>
</header>
`;

// CTA Section Template
const ctaSectionHTML = ({
	title = 'Start Your Journey Today',
	description = 'Your unforgettable journey starts here. Let us craft your perfect adventure.',
	buttonText = 'Get Free Quote',
	titleKey = '',
	descriptionKey = '',
	buttonTextKey = '',
	buttonLink = 'book-now.html',
	backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
	topCurve = true,
	topCurveColor = 'white'
} = {}) => `
<section class="relative py-20 md:py-32 overflow-hidden">
	${topCurve ? `
	<div class="absolute top-0 left-0 right-0 h-20 z-20">
		<svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120"
			xmlns="http://www.w3.org/2000/svg">
			<path d="M0,0 L1200,0 L1200,70 Q900,120 600,70 T0,70 Z" fill="${topCurveColor}" />
		</svg>
	</div>
	` : ''}
	<div class="absolute inset-0 bg-cover bg-center"
		style="background-image: url('${backgroundImage}');">
		<div class="absolute inset-0 bg-black/60"></div>
	</div>
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
		<h2 class="text-4xl md:text-5xl font-bold mb-6" ${titleKey ? `data-i18n="${titleKey}"` : ''}>${title}</h2>
		<p class="text-xl text-white/90 max-w-2xl mx-auto mb-10" ${descriptionKey ? `data-i18n="${descriptionKey}"` : ''}>${description}</p>
		<a href="${buttonLink}" class="inline-block bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-xl" ${buttonTextKey ? `data-i18n="${buttonTextKey}"` : ''}>
			${buttonText}
		</a>
	</div>
</section>
`;

const footerHTML = `
<footer class="bg-[#3E3B30] text-white py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
			<div class="col-span-2">
				<div class="text-primary font-bold text-2xl mb-4">PACHA TOURS</div>
				<p class="text-gray-400 max-w-sm" data-i18n="footer.description">Crafting unforgettable experiences across Southern Africa since
					2010. Your safety and joy are our priority.</p>
			</div>
			<div>
				<h4 class="font-bold mb-4" data-i18n="footer.links">Links</h4>
				<ul class="text-gray-400 space-y-2">
					<li><a href="index.html" class="hover:text-primary" data-i18n="nav.home">Home</a></li>
					<li><a href="Tours.html" class="hover:text-primary" data-i18n="footer.tours">Tours</a></li>
					<li><a href="Contact.html" class="hover:text-primary" data-i18n="footer.contact">Contact</a></li>
					<li><a href="blog.html" class="hover:text-primary" data-i18n="footer.blog">Blog</a></li>
					<li><a href="#" class="hover:text-primary" data-i18n="footer.terms">Terms of Service</a></li>
					<li><a href="#" class="hover:text-primary" data-i18n="footer.privacy">Privacy Policy</a></li>
				</ul>
			</div>
			<div>
				<h4 class="font-bold mb-4" data-i18n="footer.contact">Contact</h4>
				<p class="text-gray-400">Johannesburg, South Africa</p>
				<p class="text-gray-400">info@pachaafricatours.com</p>
			</div>
		</div>
		<div class="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm" data-i18n="footer.copyright">
			&copy; 2026 Pacha Tours and Travel. All rights reserved.
		</div>
	</div>
</footer>
`;

// Mobile Menu Toggle Function
function initMobileMenu() {
	const mobileMenuBtn = document.getElementById('mobile-menu-btn');
	const mobileMenu = document.getElementById('mobile-menu');

	if (!mobileMenuBtn || !mobileMenu) return;

	function toggleMobileMenu() {
		const isActive = mobileMenu.classList.contains('active');
		
		if (isActive) {
			mobileMenu.classList.remove('active');
			mobileMenuBtn.classList.remove('hamburger-active');
		} else {
			mobileMenu.classList.add('active');
			mobileMenuBtn.classList.add('hamburger-active');
		}
	}

	mobileMenuBtn.addEventListener('click', toggleMobileMenu);

	document.querySelectorAll('#mobile-menu nav a').forEach(link => {
		link.addEventListener('click', () => {
			mobileMenu.classList.remove('active');
			mobileMenuBtn.classList.remove('hamburger-active');
		});
	});
}

// Helper function to insert CTA section
function insertCTA(containerId, options = {}) {
	const container = document.getElementById(containerId);
	if (container) {
		container.innerHTML = ctaSectionHTML(options);
		// Translate after inserting
		if (typeof translatePage === 'function') {
			translatePage();
		}
	}
}

// Initialize page components
function initPage(activePage = '') {
	// Insert header
	const headerContainer = document.getElementById('header-container');
	if (headerContainer) {
		headerContainer.innerHTML = headerHTML(activePage);
	}

	// Insert footer
	const footerContainer = document.getElementById('footer-container');
	if (footerContainer) {
		footerContainer.innerHTML = footerHTML;
	}

	// Initialize mobile menu after header is inserted
	initMobileMenu();
	
	// Apply translations and update language buttons after a brief delay to ensure DOM is ready
	setTimeout(() => {
		if (typeof translatePage === 'function') {
			translatePage();
		}
		if (typeof updateLanguageButtons === 'function') {
			updateLanguageButtons();
		}
	}, 0);
}

// Tailwind Config
if (typeof tailwind !== 'undefined') {
	tailwind.config = {
		theme: {
			extend: {
				colors: {
					background: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))',
					primary: {
						DEFAULT: 'hsl(var(--primary))',
						foreground: 'hsl(var(--primary-foreground))',
					},
					secondary: 'hsl(var(--secondary))',
					muted: 'hsl(var(--muted))',
					accent: 'hsl(var(--accent))',
					border: 'hsl(var(--border))',
				},
				fontFamily: {
					poppins: ['Poppins', 'sans-serif'],
				},
				borderRadius: {
					lg: 'var(--radius)',
				}
			}
		}
	};
}
