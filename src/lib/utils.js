import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Cleans text from HTML content for text-to-speech processing
 * Removes extra whitespace, special characters, and normalizes punctuation
 */
export function cleanTextForSpeech(text) {
  return text
    .replace(/\s+/g, ' ')         // Replace multiple spaces with a single space
    .replace(/[\n\r\t\f\v]+/g, ' ')  // Replace all newlines, tabs, etc with spaces
    .replace(/\u00A0/g, ' ')      // Replace non-breaking spaces
    .replace(/\u2003/g, ' ')      // Replace em spaces
    .replace(/\u2002/g, ' ')      // Replace en spaces
    .replace(/\u2000/g, ' ')      // Replace other Unicode spaces
    .replace(/\. +/g, '. ')       // Normalize spaces after periods
    .replace(/ +\./g, '.')        // Normalize spaces before periods
    .trim();                      // Remove leading/trailing whitespace
}

/**
 * Enhanced normalization of words for comparison
 * Handles punctuation, casing, and special characters more robustly
 */
export function normalizeWord(word) {
  if (!word) return '';
  
  return word
    .toLowerCase()
    .replace(/[^\w\s']|_/g, '')  // Remove punctuation except apostrophes
    .replace(/\s+/g, ' ')        // Replace multiple spaces with a single space
    .replace(/^[']+|[']+$/g, '') // Remove leading/trailing apostrophes
    .trim();                     // Remove leading/trailing whitespace
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation
 */
export function debounce(func, wait) {
  let timeout = null;
  
  return function(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
  };
}