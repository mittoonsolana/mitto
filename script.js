// Mitto Website Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navBackdrop = document.querySelector('.nav-backdrop');
    
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navBackdrop) {
            navBackdrop.classList.toggle('active');
        }
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navBackdrop) {
            navBackdrop.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on backdrop
        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMobileMenu);
        }
        
        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Join Community Button Scroll to Community Section
    const joinCommunityBtn = document.getElementById('joinCommunityBtn');
    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener('click', function() {
            const communitySection = document.getElementById('community');
            if (communitySection) {
                communitySection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(26, 26, 46, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(26, 26, 46, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        });
    }
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animations for different elements
                if (entry.target.classList.contains('story-card')) {
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                    entry.target.classList.add('animate-slide-up');
                }
                
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.2;
                    entry.target.style.animationDelay = delay + 's';
                    entry.target.classList.add('animate-fade-in');
                }
                

                
                if (entry.target.classList.contains('social-link')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.animationDelay = delay + 's';
                    entry.target.classList.add('animate-slide-in');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    document.querySelectorAll('.story-card, .feature-card, .social-link, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Particle System Enhancement
    function createParticles() {
        const particleContainer = document.querySelector('.particles');
        if (!particleContainer) return;
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(153, 69, 255, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    // Add floating particle animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(100vh) translateX(0px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
        
        @keyframes animate-slide-up {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes animate-fade-in {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes animate-scale-in {
            from {
                opacity: 0;
                transform: scale(0.5) rotate(10deg);
            }
            to {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
        }
        
        @keyframes animate-slide-in {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .animate-slide-up {
            animation: animate-slide-up 0.8s ease forwards;
        }
        
        .animate-fade-in {
            animation: animate-fade-in 0.6s ease forwards;
        }
        
        .animate-scale-in {
            animation: animate-scale-in 0.7s ease forwards;
        }
        
        .animate-slide-in {
            animation: animate-slide-in 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize particles
    createParticles();
    
    // Button Glow Effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.btn-glow');
            if (glow) {
                glow.style.left = '-100%';
                setTimeout(() => {
                    glow.style.left = '100%';
                }, 50);
            }
        });
    });
    
    // Typing Effect for Hero Title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Initialize typing effect for hero title
    const heroTitle = document.querySelector('.hero-title .title-line');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
    
    // Parallax Effect for Hero Section
     window.addEventListener('scroll', function() {
         const scrolled = window.pageYOffset;
         const heroImage = document.querySelector('.hero-image-container');
         const heroContent = document.querySelector('.hero-content');
         
         if (heroImage && scrolled < window.innerHeight) {
             heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
         }
         
         if (heroContent && scrolled < window.innerHeight) {
             heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
         }
     });
    
    // Stats Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }
    
    // Initialize counter animations when stats come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const target = parseInt(statNumber.textContent.replace(/,/g, ''));
                    animateCounter(statNumber, target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Mouse Trail Effect
     let mouseTrail = [];
     const maxTrailLength = 10;
     
     document.addEventListener('mousemove', function(e) {
         mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
         
         if (mouseTrail.length > maxTrailLength) {
             mouseTrail.shift();
         }
         
         // Remove old trail elements
         document.querySelectorAll('.mouse-trail').forEach(trail => {
             if (Date.now() - parseInt(trail.dataset.time) > 1000) {
                 trail.remove();
             }
         });
         
         // Create new trail element
         const trail = document.createElement('div');
         trail.className = 'mouse-trail';
         trail.dataset.time = Date.now();
         trail.style.cssText = `
             position: fixed;
             left: ${e.clientX}px;
             top: ${e.clientY}px;
             width: 6px;
             height: 6px;
             background: radial-gradient(circle, rgba(153, 69, 255, 0.6), transparent);
             border-radius: 50%;
             pointer-events: none;
             z-index: 9999;
             animation: trailFade 1s ease-out forwards;
         `;
         document.body.appendChild(trail);
     });
    
    // Add trail fade animation
    const trailStyle = document.createElement('style');
    trailStyle.textContent = `
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.3);
            }
        }
    `;
    document.head.appendChild(trailStyle);
    
    // Gallery Image Lazy Loading
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Social Link Hover Effects
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Feature Card Interactive Effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
    
    // Loading Screen (if needed)
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });
    
    console.log('🚀 Mitto Website Loaded - Welcome to the Solana Universe!');
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    const scrolled = window.pageYOffset;
    
    // Update navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrolled > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.8)';
        }
    }
    
    // Parallax effects
    const heroImage = document.querySelector('.hero-image-container');
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Real X/Twitter follower profile images
const followerImages = [
    'https://pbs.twimg.com/profile_images/1982049713827278848/VsaN3T8L_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1962993544559230976/WaNs5K2s_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1974505892327428097/96IsbT91_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1981786296726040576/ORTZLmec_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1971814594860531712/niaQ0d4N_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1861494556899856384/NLWRtZS0_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1627899820487725060/6Msx4RBZ_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1957749851350810624/SR8iaLh2_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1976258692887855104/bgw2Ibac_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1819448188794765312/vGuReRhP_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1954557812601708549/AHl_M4Iy_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1972059471464501248/l0A1fpOO_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1966525379935440896/ueb8cHDe_400x400.jpg',
    'https://pbs.twimg.com/profile_images/1770839774170869761/tse1RhZw_400x400.jpg'
];

// Follower Avatars Animation
function createFollowerAvatar() {
    const avatarContainer = document.getElementById('followerAvatars');
    if (!avatarContainer) return;

    const avatar = document.createElement('div');
    avatar.className = 'follower-avatar';
    
    // Random size variation
    const sizes = ['small', '', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    if (randomSize) avatar.classList.add(randomSize);
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    avatar.style.left = leftPosition + '%';
    
    // Random animation duration (6-12 seconds)
    const duration = 6 + Math.random() * 6;
    avatar.style.animationDuration = duration + 's';
    
    // Random delay for staggered effect
    const delay = Math.random() * 2;
    avatar.style.animationDelay = delay + 's';
    
    // Create image element for real profile picture
    const img = document.createElement('img');
    const randomImage = followerImages[Math.floor(Math.random() * followerImages.length)];
    img.src = randomImage;
    img.alt = 'Follower Avatar';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    
    // Handle image load error - fallback to gradient background
    img.onerror = function() {
        avatar.removeChild(img);
        const avatarContent = generateAvatarContent();
        avatar.textContent = avatarContent;
        const gradients = [
            'linear-gradient(135deg, #9945FF, #14F195)',
            'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            'linear-gradient(135deg, #A8E6CF, #FFD93D)',
            'linear-gradient(135deg, #FF8A80, #EA80FC)',
            'linear-gradient(135deg, #81C784, #64B5F6)',
            'linear-gradient(135deg, #FFB74D, #F06292)',
            'linear-gradient(135deg, #9C27B0, #2196F3)',
            'linear-gradient(135deg, #FF5722, #FFC107)'
        ];
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        avatar.style.background = randomGradient;
    };
    
    avatar.appendChild(img);
    avatarContainer.appendChild(avatar);
    
    // Remove avatar after animation completes
    setTimeout(() => {
        if (avatar.parentNode) {
            avatar.parentNode.removeChild(avatar);
        }
    }, (duration + delay) * 1000);
}

function generateAvatarContent() {
    const cryptoSymbols = ['₿', '⟠', '◊', '⬢', '⟡', '◈', '⬟', '◉'];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const contentTypes = [
        // Crypto symbols
        () => cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)],
        // Two letters
        () => letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)],
        // Letter + number
        () => letters[Math.floor(Math.random() * letters.length)] + numbers[Math.floor(Math.random() * numbers.length)],
        // Single letter
        () => letters[Math.floor(Math.random() * letters.length)]
    ];
    
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    return randomType();
}

// Start follower avatars animation
function startFollowerAvatars() {
    // Create initial avatars
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createFollowerAvatar(), i * 1000);
    }
    
    // Continue creating avatars at random intervals
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to create an avatar
            createFollowerAvatar();
        }
    }, 2000);
}

// Initialize follower avatars when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure hero section is rendered
    setTimeout(startFollowerAvatars, 1000);
});

// Live X Stats Card Functionality
class XStatsCard {
    constructor() {
        this.currentStats = { followers: 0, posts: 0, following: 0 };
        this.isActive = false;
        this.updateInterval = null;
        this.lastUpdateTime = Date.now();
        this.postsListEl = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupStatsCard());
        } else {
            this.setupStatsCard();
        }
    }

    setupStatsCard() {
        try {
            const statsCard = document.querySelector('.x-stats-card');
            if (!statsCard) {
                console.warn('X Stats Card: Stats card element not found; proceeding with posts only');
            }

            // Hook posts list
            this.postsListEl = document.getElementById('recentPosts');
            
            // Initial fetch
            if (statsCard) {
                this.fetchAndUpdateStats();
            }
            if (this.postsListEl) {
                this.fetchAndRenderPosts();
            }
            
            // Refresh stats periodically
            if (statsCard) {
                this.startLiveApiRefresh();
            } else {
                // If no stats card, refresh posts periodically without intersection gating
                if (this.postsListEl) {
                    setInterval(() => {
                        this.fetchAndRenderPosts();
                    }, 60000);
                }
            }

            // Add intersection observer for performance
            if (statsCard) {
                this.setupIntersectionObserver();
            }
            
            // Add live indicator animation
            if (statsCard) {
                this.animateLiveIndicator();
            }
        } catch (error) {
            console.error('X Stats Card: Error setting up stats card:', error);
            this.showErrorState();
        }
    }

    animateLiveIndicator() {
        const liveIndicator = document.querySelector('.live-indicator');
        if (liveIndicator) {
            // Add pulsing animation to make it feel more live
            liveIndicator.style.animation = 'pulse 2s infinite';
        }
    }

    setupIntersectionObserver() {
        const statsCard = document.querySelector('.x-stats-card');
        if (!statsCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateUpdates();
                } else {
                    this.deactivateUpdates();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(statsCard);
    }

    activateUpdates() {
        if (this.isActive) return;
        this.isActive = true;
        // When visible, trigger refresh
        this.fetchAndUpdateStats();
        if (this.postsListEl) {
            this.fetchAndRenderPosts();
        }
    }

    deactivateUpdates() {
        this.isActive = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    startLiveApiRefresh() {
        // Refresh every 60s
        setInterval(() => {
            if (!this.isActive) return;
            this.fetchAndUpdateStats();
            if (this.postsListEl) {
                this.fetchAndRenderPosts();
            }
        }, 60000);
    }

    async fetchAndUpdateStats() {
        try {
            const res = await fetch('/api/x-stats');
            if (!res.ok) throw new Error('Stats fetch failed');
            const data = await res.json();
            this.currentStats = {
                followers: Number(data.followers) || 0,
                posts: Number(data.posts) || 0,
                following: Number(data.following) || 0,
            };
            // Update live/manual indicator based on source
            try {
                const liveIndicator = document.querySelector('.live-indicator');
                if (liveIndicator) {
                    const label = data.source === 'config' ? 'Manual Stats' : (data.source === 'mock' ? 'Fallback Stats' : 'Live Stats');
                    liveIndicator.innerHTML = '<span class="pulse-dot"></span>' + ' ' + label;
                }
            } catch (e2) {
                console.warn('X Stats Card: Unable to update live indicator label:', e2);
            }
            this.updateStatsDisplay();
            this.updateLastUpdated();
        } catch (e) {
            console.error('X Stats Card: Failed to fetch stats:', e);
        }
    }

    async fetchAndRenderPosts() {
        try {
            if (!this.postsListEl) return;
            const res = await fetch('/api/x-posts');
            if (!res.ok) throw new Error('Posts fetch failed');
            const posts = await res.json();
            this.renderPosts(posts);
        } catch (e) {
            console.error('X Stats Card: Failed to fetch posts:', e);
            if (this.postsListEl) {
                this.postsListEl.innerHTML = '<li class="post-item">Unable to load posts right now.</li>';
            }
        }
    }

    renderPosts(posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
            this.postsListEl.innerHTML = '<li class="post-item">No recent posts found.</li>';
            return;
        }
        const html = posts.slice(0, 3).map(p => {
            const created = new Date(p.created_at);
            const timeStr = created.toLocaleString();
            const textEscaped = (p.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `
                <li class="post-item">
                    <p class="post-text">${textEscaped}</p>
                    <div class="post-meta">
                        <span>${timeStr}</span>
                        <span>❤ ${p.favorite_count || 0} · 🔁 ${p.retweet_count || 0}</span>
                        <span class="post-actions"><a href="${p.url}" target="_blank" rel="noopener noreferrer">Open</a></span>
                    </div>
                </li>
            `;
        }).join('');
        this.postsListEl.innerHTML = html;
    }

    calculateGrowth(statType, timeDiffSeconds) {
        const baseRate = this.growthRate[statType]; // per minute
        const ratePerSecond = baseRate / 60;
        const expectedGrowth = ratePerSecond * timeDiffSeconds;
        
        // Add randomness - sometimes faster, sometimes slower, occasionally negative
        const randomFactor = Math.random() * 2; // 0 to 2x the expected rate
        const actualGrowth = expectedGrowth * randomFactor;
        
        // Occasional negative growth (unfollows, etc.)
        const isNegative = Math.random() < 0.1; // 10% chance of negative growth
        
        if (statType === 'followers') {
            // Followers: mostly positive, occasional small decreases
            return isNegative ? -Math.floor(Math.random() * 2) : Math.floor(actualGrowth);
        } else if (statType === 'posts') {
            // Posts: only positive, but rare
            return Math.random() < 0.05 ? 1 : 0; // 5% chance of new post per update
        } else if (statType === 'following') {
            // Following: can go up or down, but rare changes
            if (Math.random() < 0.02) { // 2% chance of change
                return Math.random() < 0.5 ? 1 : -1;
            }
            return 0;
        }
        
        return 0;
    }

    simulateStatsUpdate() {
        // Legacy method - keeping for compatibility but using new realtime method
        this.simulateRealtimeGrowth();
    }

    updateStatsDisplay() {
        try {
            const followersEl = document.querySelector('[data-stat="followers"]');
            const postsEl = document.querySelector('[data-stat="posts"]');
            const followingEl = document.querySelector('[data-stat="following"]');

            if (followersEl) {
                this.animateNumber(followersEl, this.currentStats.followers);
            } else {
                console.warn('X Stats Card: Followers element not found');
            }
            
            if (postsEl) {
                this.animateNumber(postsEl, this.currentStats.posts);
            } else {
                console.warn('X Stats Card: Posts element not found');
            }
            
            if (followingEl) {
                this.animateNumber(followingEl, this.currentStats.following);
            } else {
                console.warn('X Stats Card: Following element not found');
            }
        } catch (error) {
            console.error('X Stats Card: Error updating stats display:', error);
            this.showErrorState();
        }
    }

    animateNumber(element, targetValue) {
        try {
            if (!element) {
                console.warn('X Stats Card: Cannot animate number - element is null');
                return;
            }

            const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const difference = targetValue - currentValue;
            
            // Skip animation if no change
            if (difference === 0) return;
            
            const duration = 800; // Animation duration in ms
            const steps = 20;
            const stepValue = difference / steps;
            const stepDuration = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                try {
                    currentStep++;
                    const newValue = Math.round(currentValue + (stepValue * currentStep));
                    element.textContent = this.formatNumber(newValue);

                    if (currentStep >= steps) {
                        clearInterval(timer);
                        element.textContent = this.formatNumber(targetValue);
                    }
                } catch (error) {
                    console.error('X Stats Card: Error during number animation:', error);
                    clearInterval(timer);
                    element.textContent = this.formatNumber(targetValue);
                }
            }, stepDuration);
        } catch (error) {
            console.error('X Stats Card: Error setting up number animation:', error);
            // Fallback: set value directly
            if (element) {
                element.textContent = this.formatNumber(targetValue);
            }
        }
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    updateLastUpdated() {
        try {
            const lastUpdatedEl = document.querySelector('.last-updated');
            if (lastUpdatedEl) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                });
                lastUpdatedEl.textContent = `Last updated: ${timeString}`;
            } else {
                console.warn('X Stats Card: Last updated element not found');
            }
        } catch (error) {
            console.error('X Stats Card: Error updating last updated time:', error);
        }
    }

    showErrorState() {
        try {
            const followersEl = document.querySelector('[data-stat="followers"]');
            const postsEl = document.querySelector('[data-stat="posts"]');
            const followingEl = document.querySelector('[data-stat="following"]');
            const lastUpdatedEl = document.querySelector('.last-updated');

            if (followersEl) followersEl.textContent = 'Error';
            if (postsEl) postsEl.textContent = 'Error';
            if (followingEl) followingEl.textContent = 'Error';
            if (lastUpdatedEl) lastUpdatedEl.textContent = 'Last updated: Error loading data';

            // Stop updates
            this.deactivateUpdates();
        } catch (error) {
            console.error('X Stats Card: Error showing error state:', error);
        }
    }

    resetToBaseStats() {
        try {
            this.currentStats = { ...this.baseStats };
            this.updateStatsDisplay();
            this.updateLastUpdated();
        } catch (error) {
            console.error('X Stats Card: Error resetting to base stats:', error);
            this.showErrorState();
        }
    }
}

// Initialize X Stats Card
document.addEventListener('DOMContentLoaded', function() {
    new XStatsCard();
});

// Notice Popup Functions
function closeNoticePopup() {
    const popup = document.getElementById('noticePopup');
    if (popup) {
        popup.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
}

// Close popup on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNoticePopup();
    }
});

// Add fadeOut animation to CSS if not already present
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Prevent images from being opened in new tabs and dragged
document.addEventListener('DOMContentLoaded', function() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        // Disable dragging
        img.setAttribute('draggable', 'false');
        // Block right-click context menu on images
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        // If an image is wrapped in a link pointing directly to an image file, prevent open
        img.addEventListener('click', function(e) {
            const link = img.closest('a');
            if (!link) return;
            const href = link.getAttribute('href') || '';
            if (/\.(png|jpe?g|gif|webp|svg)$/i.test(href)) {
                e.preventDefault();
            }
        });
    });
});
