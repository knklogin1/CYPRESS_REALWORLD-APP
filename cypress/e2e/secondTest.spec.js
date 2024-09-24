
describe('Test log out', () => {

    beforeEach('login to the app', () => {
        cy.loginToApplication()
    })

    it('Verify user can log out successfully',{retries:2},() => {       // {retries:2) is a object and it will run the script for 3 attempts}
        cy.contains('Settings').click()
        cy.contains(' Or click here to logout. ').click()
        cy.get('.navbar-nav').should('contain',' Sign up ')
    })
})