<<<<<<< HEAD
//!FIXME Change selector (ID or react)
=======
>>>>>>> style: Prettier with eslint
import { Selector } from 'testcafe'

export default class Page {
  constructor() {
    this.password = Selector('#password')
    this.loginButton = Selector('#login-submit')
  }
}
