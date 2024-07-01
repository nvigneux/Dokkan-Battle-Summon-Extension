describe('Ouverture de la page Dokkan Battle Summon', () => {
  it('should open the specified extension popup', async () => {
    cy.visit('chrome-extension://mhdjoohjkgnccjfcakmjjaefehknceop/index.html')
    // essaye avec page goto
    await page.goto('chrome-extension://mhdjoohjkgnccjfcakmjjaefehknceop/index.html');
  });
});