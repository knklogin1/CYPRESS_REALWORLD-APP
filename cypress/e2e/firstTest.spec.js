describe('Test With Backend', () => {

  beforeEach('login to application',() => {
    cy.intercept('GET','https://conduit-api.bondaracademy.com/api/tags', {fixture:'tags.json'})
    cy.loginToApplication()
  })

  it('first', () => {
    cy.log('Yaay we have logged in')
  })

  it('Verify correct request and response',() => {

    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles').as('postArticles')  // need to add intercept - check this syntax

    cy.contains(' New Article ').click()
    cy.get('[formcontrolname="title"]').type('Kedar is creating the article-TEST')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of article')
    cy.contains(' Publish Article ').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {   // instead of this code you can also write one line code as below
      
      //cy.wait('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is a body of article')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })

  })

  it('verify popular tags are displayed', () => {

  cy.get('.tag-list').should('contain','Cypress')
  .and('contain','automation')
  .and('contain','testing')

  })

  it('verify global feeds likes count', () => {

  cy.intercept('GET','https://conduit-api.bondaracademy.com/api/articles/feed*',{"articles":[],"articlesCount":0})
  cy.intercept('GET','https://conduit-api.bondaracademy.com/api/articles*', {fixture:'articles.json'})

  cy.contains(' Global Feed ').click()
  cy.get('app-article-list button').then(heartList => {
    expect(heartList[0]).to.contain('1')
    expect(heartList[1]).to.contain('5')
  })

  // to use article.json file use in cypress - use the following command

  cy.fixture('articles').then(file => {
    const articleLink = file.articles[1].slug
    file.articles[1].favoritesCount = 6
    cy.intercept('POST','https://conduit-api.bondaracademy.com/api/articles/'+articleLink+'/favorite', file)
  })

  cy.get('app-article-list button').eq(1).click().should('contain','6')
  })

  it('delete a new article in a new feed', () => {

  const userCredentials = {
    "user": {
        "email": "kedar@mailinator.com",
        "password": "admin123"
    }
  }

  const bodyRequest = {
    "article": {
        //"slug": "The-article-for-API-testing-8207",
        "title": "The article for API testing",
        "description": "backend testing",
        "body": "The backend started here",
        "tagList": []
      }
  }

  cy.request('POST',Cypress.env('apiURL')+'api/users/login',userCredentials)  // performing login activity using API
  .its('body').then(body => {
    const token = body.user.token

      cy.request({
        url: Cypress.env('apiURL')+'api/articles/',     // creating new article using the generated token
        headers: {'Authorization':'Token '+token},
        method: 'POST',      // https://conduit-api.bondaracademy.com/api/articles/
        body: bodyRequest
      }).then(response => {
          expect(response.status).to.equal(201)
        })

        cy.contains('Global Feed').click()            // deleting the first token
        cy.get('.article-preview').first().contains(bodyRequest.article.title).click()
        cy.wait(500)
        cy.get('.article-actions').contains(' Delete Article ').click()

        cy.request({        // cy.request will create the JSON object like url,header and method etc.
          url: Cypress.env('apiURL')+'api/articles?limit=10&offset=0',   // this is the API for global feed page
          headers: {'Authorization':'Token '+token},
          method: 'GET'
        }).its('body').then(body =>{
          expect(body.articles[0].title).not.to.equal('The article for API testing')    // here why article's' are used. in body there is article onle present
        })
  })
        
  })

})