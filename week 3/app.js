/**
 * CITY HARDWARE AUTH SYSTEM
 * Unified Sign Up + Login with Dynamic User Welcome
 */

class CityHWAuth {
    constructor() {
        // Demo user database (simulating backend)
        this.knownUsers = {
            'alex@example.com': { firstName: 'Alex', lastName: 'Johnson', color: '#f97316', avatar: 'A' },
            'maria@example.com': { firstName: 'Maria', lastName: 'Garcia', color: '#8b5cf6', avatar: 'M' },
            'james@example.com': { firstName: 'James', lastName: 'Wilson', color: '#06b6d4', avatar: 'J' },
            'sarah@example.com': { firstName: 'Sarah', lastName: 'Chen', color: '#ec4899', avatar: 'S' }
        };

        // Store newly registered users
        this.registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');

        this.maxAttempts = 5;
        this.attempts = 0;
        this.loginHistory = [];
        this.sessionTime = 300;
        this.sessionInterval = null;
        this.currentMode = 'login';
        this.currentUser = null;

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.startSessionTimer();
        this.loadSavedCredentials();
    }

    cacheElements() {
        this.loginTab = document.getElementById('loginTab');
        this.signupTab = document.getElementById('signupTab');
        this.tabIndicator = document.getElementById('tabIndicator');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');

        // Welcome section
        this.welcomeSection = document.getElementById('welcomeSection');
        this.welcomeAvatar = document.getElementById('welcomeAvatar');
        this.welcomeGreeting = document.getElementById('welcomeGreeting');
        this.welcomeName = document.getElementById('welcomeName');
        this.nameText = document.getElementById('nameText');
        this.nameCursor = document.getElementById('nameCursor');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.heroContent = document.getElementById('heroContent');

        // Login elements
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginSubmit = document.getElementById('loginSubmit');
        this.loginTitle = document.getElementById('loginTitle');
        this.loginSubtitle = document.getElementById('loginSubtitle');

        // Signup elements
        this.signupFirstName = document.getElementById('signupFirstName');
        this.signupLastName = document.getElementById('signupLastName');
        this.signupEmail = document.getElementById('signupEmail');
        this.signupPhone = document.getElementById('signupPhone');
        this.signupUsername = document.getElementById('signupUsername');
        this.signupPassword = document.getElementById('signupPassword');
        this.signupConfirm = document.getElementById('signupConfirmPassword');
        this.signupAge = document.getElementById('signupAge');
        this.signupTerms = document.getElementById('signupTerms');
        this.signupSubmit = document.getElementById('signupSubmit');

        // Shared
        this.toast = document.getElementById('toast');
        this.attemptsCounter = document.getElementById('attemptsCounter');
        this.historySection = document.getElementById('loginHistory');
        this.historyList = document.getElementById('loginHistoryList');
    }

    setupEventListeners() {
        // Mode tabs
        this.loginTab.addEventListener('click', () => this.switchMode('login'));
        this.signupTab.addEventListener('click', () => this.switchMode('signup'));

        document.querySelectorAll('.switch-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchMode(link.dataset.target);
            });
        });

        // Login email - Dynamic user recognition
        this.loginEmail.addEventListener('input', (e) => {
            this.updateCharCounter(this.loginEmail, 'loginEmailCounter', 100);
            this.validateEmailRealtime(this.loginEmail);
            this.checkUserRecognition(this.loginEmail.value);
        });

        this.loginEmail.addEventListener('focus', () => {
            this.showTooltip('loginEmailTooltip', this.loginEmail);
        });

        this.loginEmail.addEventListener('blur', () => {
            this.hideTooltip('loginEmailTooltip');
        });

        // Login password
        this.loginPassword.addEventListener('input', () => {
            this.updateCharCounter(this.loginPassword, 'loginPasswordCounter', 50);
            this.updatePasswordPeek(this.loginPassword, 'loginPasswordPeek');
            this.validatePasswordRealtime(this.loginPassword);
        });

        this.loginPassword.addEventListener('focus', () => {
            this.showTooltip('loginPasswordTooltip', this.loginPassword);
        });

        this.loginPassword.addEventListener('blur', () => {
            this.hideTooltip('loginPasswordTooltip');
        });

        // Password toggles
        document.getElementById('loginTogglePassword').addEventListener('click', () => {
            this.togglePassword(this.loginPassword, 'loginTogglePassword');
        });

        document.getElementBy