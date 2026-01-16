/**
 * Validation Utilities
 * Production-grade validation for forms and inputs
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * Requires: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get password validation errors
 */
export const getPasswordErrors = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  return errors;
};

/**
 * Username validation
 * Alphanumeric, underscores, hyphens, 3-20 characters
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Phone number validation (International)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * URL validation
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Product code validation (alphanumeric with hyphens)
 */
export const validateProductCode = (code) => {
  const codeRegex = /^[A-Z0-9-]{3,20}$/;
  return codeRegex.test(code);
};

/**
 * Part number validation
 */
export const validatePartNumber = (partNumber) => {
  const partRegex = /^[A-Z0-9-]{3,30}$/;
  return partRegex.test(partNumber);
};

/**
 * Generic required field validation
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Min length validation
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Max length validation
 */
export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Min value validation (for numbers)
 */
export const validateMin = (value, min) => {
  const num = Number(value);
  return !isNaN(num) && num >= min;
};

/**
 * Max value validation (for numbers)
 */
export const validateMax = (value, max) => {
  const num = Number(value);
  return !isNaN(num) && num <= max;
};

/**
 * Range validation (for numbers)
 */
export const validateRange = (value, min, max) => {
  return validateMin(value, min) && validateMax(value, max);
};

/**
 * Date validation
 */
export const validateDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Date in future validation
 */
export const validateFutureDate = (dateString) => {
  if (!validateDate(dateString)) return false;
  return new Date(dateString) > new Date();
};

/**
 * Compare two dates
 */
export const validateDateRange = (startDate, endDate) => {
  if (!validateDate(startDate) || !validateDate(endDate)) return false;
  return new Date(startDate) < new Date(endDate);
};

/**
 * Array validation (not empty)
 */
export const validateArrayNotEmpty = (array) => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * File validation
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  } = options;

  if (!file) return false;
  if (file.size > maxSize) return false;
  if (!allowedTypes.includes(file.type)) return false;
  return true;
};

/**
 * Get file validation errors
 */
export const getFileErrors = (file, options = {}) => {
  const errors = [];
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  } = options;

  if (!file) {
    errors.push('File is required');
    return errors;
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return errors;
};

/**
 * Form validation helper
 * Validates multiple fields and returns errors object
 */
export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach((fieldName) => {
    const validators = schema[fieldName];
    const value = formData[fieldName];

    validators.forEach((validator) => {
      if (!validator.validate(value)) {
        if (!errors[fieldName]) {
          errors[fieldName] = [];
        }
        errors[fieldName].push(validator.message);
      }
    });
  });

  return errors;
};

/**
 * Check if form has errors
 */
export const hasFormErrors = (errors) => {
  return Object.keys(errors).some((key) => errors[key] && errors[key].length > 0);
};

export default {
  validateEmail,
  validatePassword,
  getPasswordErrors,
  validateUsername,
  validatePhone,
  validateUrl,
  validateProductCode,
  validatePartNumber,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateMin,
  validateMax,
  validateRange,
  validateDate,
  validateFutureDate,
  validateDateRange,
  validateArrayNotEmpty,
  validateFile,
  getFileErrors,
  validateForm,
  hasFormErrors,
};
