// Header and Footer HTML Templates
const headerHTML = (activePage = '') => `
<header class="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
		<img src="images/Frame-1.svg" alt="Logo" class="h-16 pl-5">

		<nav class="hidden md:flex items-center space-x-8 font-medium text-gray-600">
			<a href="index.html" class="hover:text-primary py-2 transition-colors ${activePage === 'home' ? 'text-primary' : ''}" data-i18n="nav.home">Home</a>
			<a href="Contact.html" class="hover:text-primary py-2 transition-colors ${activePage === 'contact' ? 'text-primary' : ''}" data-i18n="nav.contact">Contact</a>
			<a href="Tours.html" class="hover:text-primary py-2 transition-colors ${activePage === 'tours' ? 'text-primary' : ''}" data-i18n="nav.tours">Tours</a>
			<a href="about.html" class="hover:text-primary py-2 transition-colors ${activePage === 'about' ? 'text-primary' : ''}" data-i18n="nav.about">About</a>
		</nav>

		<div class="hidden md:flex items-center gap-3">
			<!-- Language Switcher -->
			<div class="flex items-center gap-1 bg-gray-100 rounded-full p-1">
				<button id="lang-en" onclick="setLanguage('en')" class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all">
					EN
				</button>
				<button id="lang-fr" onclick="setLanguage('fr')" class="px-3 py-1.5 rounded-full text-sm font-semibold transition-all">
					FR
				</button>
			</div>

			<!-- Auth Buttons (shown when signed out) -->
			<div id="auth-buttons" class="flex items-center gap-2">
				<button onclick="openAuthModal('login')" class="text-gray-600 hover:text-primary px-4 py-2 rounded-full font-semibold text-sm transition-all hover:bg-gray-50">
					Sign In
				</button>
				<button onclick="openAuthModal('signup')" class="border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-full font-semibold text-sm transition-all">
					Sign Up
				</button>
			</div>

			<!-- User Menu (shown when signed in) -->
			<div id="user-menu" class="hidden items-center gap-2">
				<div class="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2">
					<div class="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold" id="user-avatar-initials">U</div>
					<span class="text-sm font-semibold text-gray-700" id="user-display-name">User</span>
				</div>
				<button onclick="signOutUser()" class="text-gray-400 hover:text-red-500 text-xs px-2 py-1 transition-colors" title="Sign out">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
				</button>
			</div>

			<a href="book-now.html" class="bg-primary text-white px-7 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 hover:shadow-lg transition-all transform hover:scale-105" data-i18n="nav.bookNow">
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

			<!-- Mobile Auth Buttons -->
			<div id="auth-buttons-mobile" class="pt-2 flex gap-3">
				<button onclick="openAuthModal('login')" class="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:border-primary hover:text-primary text-center">
					Sign In
				</button>
				<button onclick="openAuthModal('signup')" class="flex-1 border-2 border-primary text-primary px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:bg-primary hover:text-white text-center">
					Sign Up
				</button>
			</div>
			<!-- Mobile User Menu -->
			<div id="user-menu-mobile" class="hidden pt-2">
				<div class="flex items-center justify-between bg-stone-50 rounded-2xl px-4 py-3 border border-stone-200">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
						<span class="text-sm font-semibold text-gray-700" id="user-display-name-mobile">User</span>
					</div>
					<button onclick="signOutUser()" class="text-xs text-red-400 hover:text-red-600 font-semibold">Sign out</button>
				</div>
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

// Auth Modal HTML
const authModalHTML = `
<div id="auth-modal" class="hidden fixed inset-0 z-[100] items-center justify-center p-4" role="dialog" aria-modal="true">
	<!-- Backdrop -->
	<div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeAuthModal()"></div>
	
	<!-- Modal Card -->
	<div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
		<!-- Header accent -->
		<div class="h-1.5 w-full bg-primary"></div>
		
		<div class="p-8">
			<!-- Logo / Brand -->
			<div class="text-center mb-6">
				<div class="text-primary font-bold text-xl tracking-wide">PACHA TOURS</div>
				<p class="text-gray-500 text-sm mt-1">Your Southern Africa adventure awaits</p>
			</div>

			<!-- Tabs -->
			<div class="flex border-b border-gray-200 mb-6">
				<button id="auth-login-tab" onclick="switchAuthTab('login')"
					class="flex-1 pb-3 text-sm font-semibold text-gray-500 transition-all border-b-2 border-primary text-primary">
					Sign In
				</button>
				<button id="auth-signup-tab" onclick="switchAuthTab('signup')"
					class="flex-1 pb-3 text-sm font-semibold text-gray-500 transition-all">
					Create Account
				</button>
			</div>

			<!-- Login Form -->
			<form id="auth-login-form" onsubmit="handleLoginSubmit(event)" class="space-y-4">
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
					<input id="login-email" type="email" required placeholder="you@example.com"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
					<input id="login-password" type="password" required placeholder="Your password"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div id="login-form-error" class="auth-error hidden text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"></div>
				<button id="login-submit-btn" type="submit"
					class="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
					Sign In
				</button>
				<button type="button" onclick="handleGoogleSignIn()"
					class="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
					<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
					Continue with Google
				</button>
				<p class="text-center text-xs text-gray-500">
					Don't have an account? <button type="button" onclick="switchAuthTab('signup')" class="text-primary font-semibold hover:underline">Sign up free</button>
				</p>
			</form>

			<!-- Signup Form -->
			<form id="auth-signup-form" onsubmit="handleSignupSubmit(event)" class="space-y-4 hidden">
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
					<input id="signup-name" type="text" required placeholder="Your full name"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
					<input id="signup-email" type="email" required placeholder="you@example.com"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
					<input id="signup-password" type="password" required placeholder="Min. 6 characters"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
					<input id="signup-confirm" type="password" required placeholder="Repeat password"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50">
				</div>
				<div id="signup-form-error" class="auth-error hidden text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"></div>
				<button id="signup-submit-btn" type="submit"
					class="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
					Create Account
				</button>
				<button type="button" onclick="handleGoogleSignIn()"
					class="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
					<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84z"/></svg>
					Sign up with Google
				</button>
				<p class="text-center text-xs text-gray-500">
					Already have an account? <button type="button" onclick="switchAuthTab('login')" class="text-primary font-semibold hover:underline">Sign in</button>
				</p>
			</form>
		</div>

		<!-- Close button -->
		<button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
		</button>
	</div>
</div>
`;

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

	// Insert auth modal into body
	const modalContainer = document.createElement('div');
	modalContainer.innerHTML = authModalHTML;
	document.body.appendChild(modalContainer.firstElementChild);

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

// Google sign-in handler (global, called from modal HTML)
async function handleGoogleSignIn() {
	const result = await signInWithGoogle();
	if (!result.success) {
		const activeForm = document.getElementById('auth-login-form').classList.contains('hidden') ? 'signup-form' : 'login-form';
		showAuthError(activeForm, result.error);
	}
}

// Override onUserSignedIn to also handle mobile menu
const _origOnUserSignedIn = typeof onUserSignedIn !== 'undefined' ? onUserSignedIn : null;
function onUserSignedIn(user) {
	const authBtns = document.getElementById('auth-buttons');
	const userMenu = document.getElementById('user-menu');
	const userName = document.getElementById('user-display-name');
	const avatarInitials = document.getElementById('user-avatar-initials');
	const authBtnsMobile = document.getElementById('auth-buttons-mobile');
	const userMenuMobile = document.getElementById('user-menu-mobile');
	const userNameMobile = document.getElementById('user-display-name-mobile');

	const displayName = user.displayName || user.email.split('@')[0];
	const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

	if (authBtns) authBtns.classList.add('hidden');
	if (userMenu) { userMenu.classList.remove('hidden'); userMenu.classList.add('flex'); }
	if (userName) userName.textContent = displayName;
	if (avatarInitials) avatarInitials.textContent = initials;
	if (authBtnsMobile) authBtnsMobile.classList.add('hidden');
	if (userMenuMobile) userMenuMobile.classList.remove('hidden');
	if (userNameMobile) userNameMobile.textContent = displayName;

	closeAuthModal();
	document.dispatchEvent(new CustomEvent('userSignedIn', { detail: user }));
}

function onUserSignedOut() {
	currentUser = null;
	const authBtns = document.getElementById('auth-buttons');
	const userMenu = document.getElementById('user-menu');
	const authBtnsMobile = document.getElementById('auth-buttons-mobile');
	const userMenuMobile = document.getElementById('user-menu-mobile');

	if (authBtns) authBtns.classList.remove('hidden');
	if (userMenu) { userMenu.classList.add('hidden'); userMenu.classList.remove('flex'); }
	if (authBtnsMobile) authBtnsMobile.classList.remove('hidden');
	if (userMenuMobile) userMenuMobile.classList.add('hidden');
	document.dispatchEvent(new CustomEvent('userSignedOut'));
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