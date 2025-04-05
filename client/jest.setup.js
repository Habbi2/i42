import '@testing-library/jest-dom';

// Silence React Router warnings during tests to keep output clean
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('React Router') || 
     args[0].includes('startTransition') ||
     args[0].includes('v7_'))
  ) {
    return;
  }
  originalWarn(...args);
};