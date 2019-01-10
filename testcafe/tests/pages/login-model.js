<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
//!FIXME Change selector (ID or react)
=======
>>>>>>> style: Prettier with eslint
=======
//!FIXME Change selector (ID or react)
>>>>>>> refactor: Some fix to code according to PR comments 
=======
//!FIXME Change selector (ID or react)
>>>>>>> test: testcafe tests update and travis configuration
import { Selector } from 'testcafe'

export default class Page {
  constructor() {
    this.password = Selector('#password')
    this.loginButton = Selector('#login-submit')
  }
}
