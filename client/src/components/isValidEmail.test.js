
//test isValidEmail func from signUpForm.js




const isValidEmail = require('./components/signUpForm');

test('Valid email addresses should return true', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidEmail('another.email@example.com')).toBe(true);
});

test('Invalid email addresses should return false', () => {
  expect(isValidEmail('invalid-email')).toBe(false);
  expect(isValidEmail('email@withoutat')).toBe(false);
});
