// Authentication System JavaScript
class AuthSystem {
  constructor() {
    this.init();
    this.validationRules = {
      firstName: { required: true, minLength: 2, maxLength: 50 },
      lastName: { required: true, minLength: 2, maxLength: 50 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      username: { required: true, minLength: 3, maxLength: 30 },
      password: { required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W])/ },
      confirmPassword: { required: true, match: 'password' },
      agreeTerms: { required: true }
    };
  }

  init() {
    this.bindEvents();
    this.initPasswordToggles();
    this.initPasswordStrength();
    this.initFormValidation();
    this.initPasswordRecovery();
    this.checkAuthState();
    this.addAccessibilityFeatures();
  }

  bindEvents() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Social auth buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleSocialAuth(e));
    });

    // Real-time validation
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.handleInputChange(e.target));
    });
  }

  initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const wrapper = e.target.closest('.input-wrapper');
        const input = wrapper.querySelector('input');
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
          toggle.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
          toggle.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }

  initPasswordStrength() {
    const passwordInput = document.getElementById('signupPassword');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar) {
      passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = this.calculatePasswordStrength(password);
        
        strengthBar.style.width = `${strength.percentage}%`;
        strengthBar.style.background = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
      });
    }

    // Confirm password matching
    const confirmInput = document.getElementById('confirmPassword');
    const matchIndicator = document.getElementById('passwordMatch');

    if (confirmInput && matchIndicator) {
      confirmInput.addEventListener('input', (e) => {
        const password = document.getElementById('signupPassword')?.value || '';
        const confirm = e.target.value;

        if (confirm === '') {
          matchIndicator.innerHTML = '';
          matchIndicator.className = 'password-match';
        } else if (password === confirm) {
          matchIndicator.innerHTML = '<i class="fas fa-check"></i>';
          matchIndicator.className = 'password-match match';
          matchIndicator.setAttribute('aria-label', 'Passwords match');
        } else {
          matchIndicator.innerHTML = '<i class="fas fa-times"></i>';
          matchIndicator.className = 'password-match no-match';
          matchIndicator.setAttribute('aria-label', 'Passwords do not match');
        }
      });
    }
  }

  calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('at least 8 characters');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('uppercase letter');

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('lowercase letter');

    if (/[\d\W]/.test(password)) score += 25;
    else feedback.push('number or special character');

    let strength = {
      percentage: score,
      color: '#f44336',
      text: 'Weak - Add ' + feedback.join(', ')
    };

    if (score >= 100) {
      strength.color = '#4caf50';
      strength.text = 'Strong password';
    } else if (score >= 75) {
      strength.color = '#8bc34a';
      strength.text = 'Good password';
    } else if (score >= 50) {
      strength.color = '#ff9800';
      strength.text = 'Fair password';
    } else if (score >= 25) {
      strength.color = '#ff5722';
      strength.text = 'Weak password';
    }

    return strength;
  }

  initFormValidation() {
    // Add ARIA attributes for better accessibility
    document.querySelectorAll('input[required]').forEach(input => {
      input.setAttribute('aria-required', 'true');
    });
  }

  initPasswordRecovery() {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const modal = document.getElementById('passwordRecoveryModal');
    const closeBtn = document.getElementById('closeRecoveryModal');
    const recoveryForm = document.getElementById('passwordRecoveryForm');

    if (forgotPasswordLink && modal) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showModal(modal);
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.hideModal(modal);
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideModal(modal);
        }
      });

      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          this.hideModal(modal);
        }
      });
    }

    if (recoveryForm) {
      recoveryForm.addEventListener('submit', (e) => this.handlePasswordRecovery(e));
    }
  }

  showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    this.hideMessages();
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = this.validationRules[fieldName];
    
    if (!rules) return true;

    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (rules.required && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    }
    // Length validation
    else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
    }
    else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} must be no more than ${rules.maxLength} characters`;
    }
    // Pattern validation
    else if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = this.getPatternErrorMessage(fieldName);
    }
    // Match validation (for confirm password)
    else if (rules.match) {
      const matchField = document.querySelector(`[name="${rules.match}"]`);
      if (matchField && value !== matchField.value) {
        isValid = false;
        errorMessage = 'Passwords do not match';
      }
    }
    // Checkbox validation
    else if (fieldName === 'agreeTerms' && !field.checked) {
      isValid = false;
      errorMessage = 'You must agree to the Terms of Service';
    }

    if (isValid) {
      this.clearFieldError(field);
    } else {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  getFieldLabel(fieldName) {
    const labels = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return labels[fieldName] || fieldName;
  }

  getPatternErrorMessage(fieldName) {
    const messages = {
      email: 'Please enter a valid email address',
      password: 'Password must contain uppercase, lowercase, and number/special character',
      username: 'Username can only contain letters, numbers, and underscores'
    };
    return messages[fieldName] || 'Invalid format';
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    
    const errorId = `${field.name}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
      errorElement.classList.add('show');
      field.setAttribute('aria-describedby', errorId);
      field.setAttribute('aria-invalid', 'true');
    }
    
    field.style.borderColor = 'var(--error-color)';
  }

  clearFieldError(field) {
    const errorId = `${field.name}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.classList.remove('show');
      field.removeAttribute('aria-describedby');
      field.removeAttribute('aria-invalid');
    }
    
    field.style.borderColor = '';
  }

  handleInputChange(field) {
    // Clear error on input change
    if (field.style.borderColor === 'var(--error-color)') {
      this.clearFieldError(field);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const remember = formData.get('remember');

    this.hideMessages();

    // Validate form
    let isValid = true;
    const usernameField = form.querySelector('[name="username"]');
    const passwordField = form.querySelector('[name="password"]');

    if (!this.validateField(usernameField)) isValid = false;
    if (!this.validateField(passwordField)) isValid = false;

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    this.setButtonLoading(submitBtn, true);

    try {
      await this.simulateLogin(username, password);
      
      this.setAuthState(username, remember);
      this.showSuccess('loginSuccess', 'Login successful! Redirecting...');
      
      // Update navigation
      if (window.updateNavigationAuth) {
        window.updateNavigationAuth(true, { email: username });
      }
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      this.showError('loginError', error.message);
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    this.hideMessages();

    // Validate all fields
    let isValid = true;
    const fields = form.querySelectorAll('input');
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    this.setButtonLoading(submitBtn, true);

    try {
      await this.simulateSignup(formData);
      
      this.setAuthState(formData.get('email'), false);
      this.showSuccess('signupSuccess', 'Account created successfully! Redirecting...');
      
      // Update navigation
      if (window.updateNavigationAuth) {
        window.updateNavigationAuth(true, { 
          email: formData.get('email'),
          name: `${formData.get('firstName')} ${formData.get('lastName')}`
        });
      }
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      this.showError('signupError', error.message);
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async handlePasswordRecovery(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('recoveryEmail');

    this.hideMessages();

    const emailField = form.querySelector('[name="recoveryEmail"]');
    if (!this.validateField(emailField)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    this.setButtonLoading(submitBtn, true);

    try {
      await this.simulatePasswordRecovery(email);
      this.showSuccess('recoverySuccess', 'Password reset link sent to your email!');
      
      setTimeout(() => {
        const modal = document.getElementById('passwordRecoveryModal');
        this.hideModal(modal);
        form.reset();
      }, 2000);

    } catch (error) {
      this.showError('recoveryError', error.message);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async simulateLogin(username, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const validCredentials = [
      { username: 'demo@renewify.com', password: 'Demo123!' },
      { username: 'demo', password: 'Demo123!' },
      { username: 'user@example.com', password: 'Password123!' }
    ];

    const isValid = validCredentials.some(cred => 
      (cred.username === username || cred.username === username) && cred.password === password
    );

    if (!isValid) {
      throw new Error('Invalid username or password. Try demo@renewify.com / Demo123!');
    }

    return { success: true, user: { username } };
  }

  async simulateSignup(formData) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const email = formData.get('email');
    if (email === 'taken@example.com') {
      throw new Error('An account with this email already exists');
    }

    return { success: true, user: { email } };
  }

  async simulatePasswordRecovery(email) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate checking if email exists
    if (email === 'notfound@example.com') {
      throw new Error('No account found with this email address');
    }

    return { success: true };
  }

  handleSocialAuth(e) {
    const provider = e.target.closest('.social-btn').classList.contains('google') ? 'Google' : 'Facebook';
    
    const btn = e.target.closest('.social-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      this.setAuthState('social@example.com', false);
      
      if (window.updateNavigationAuth) {
        window.updateNavigationAuth(true, { 
          email: 'social@example.com',
          name: 'Social User'
        });
      }
      
      window.location.href = 'index.html';
    }, 2000);
  }

  setAuthState(email, remember) {
    const authData = {
      email,
      loginTime: new Date().toISOString(),
      isLoggedIn: true
    };

    if (remember) {
      localStorage.setItem('renewify_auth', JSON.stringify(authData));
    } else {
      sessionStorage.setItem('renewify_auth', JSON.stringify(authData));
    }
  }

  checkAuthState() {
    const authData = localStorage.getItem('renewify_auth') || sessionStorage.getItem('renewify_auth');
    
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth.isLoggedIn) {
          console.log('User is already authenticated:', auth.email);
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }

  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.classList.remove('loading');
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
      errorElement.classList.add('show');
      errorElement.classList.add('fade-in');
      errorElement.setAttribute('role', 'alert');
    }
  }

  showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
      successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
      successElement.classList.add('show');
      successElement.classList.add('fade-in');
      successElement.setAttribute('role', 'alert');
    }
  }

  hideMessages() {
    document.querySelectorAll('.error-message, .success-message, .field-error').forEach(el => {
      el.classList.remove('show', 'fade-in');
    });
  }

  addAccessibilityFeatures() {
    // Add live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Announce form validation errors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('show') && target.classList.contains('field-error')) {
            liveRegion.textContent = target.textContent;
          }
        }
      });
    });

    document.querySelectorAll('.field-error').forEach(errorElement => {
      observer.observe(errorElement, { attributes: true });
    });

    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('.auth-main');
    if (mainContent) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
    }
  }
}

// Initialize the authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthSystem();
});

// Utility functions for other pages to check auth state
window.AuthUtils = {
  isLoggedIn() {
    const authData = localStorage.getItem('renewify_auth') || sessionStorage.getItem('renewify_auth');
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        return auth.isLoggedIn === true;
      } catch (error) {
        return false;
      }
    }
    return false;
  },

  getCurrentUser() {
    const authData = localStorage.getItem('renewify_auth') || sessionStorage.getItem('renewify_auth');
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        return auth.isLoggedIn ? auth : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('renewify_auth');
    sessionStorage.removeItem('renewify_auth');
    
    if (window.updateNavigationAuth) {
      window.updateNavigationAuth(false);
    }
    
    window.location.href = 'login.html';
  }
};