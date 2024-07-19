import { getGreeting } from '../support/app.po';

describe('nerv', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to nerv!');
  });
});
