import { Selector, Role, ClientFunction } from 'testcafe';
import config from '../../config';


//Returns the URL of the current web page
const getPageUrl = ClientFunction(() => window.location.href);


export const regularUser = Role(`${config.loginUrl}`, async t => {
    await t
        .typeText(Selector('#password'), `${config.password}`)
        .click(Selector('#login-submit').find('.password-form'))
        .expect(getPageUrl()).contains('home'); //Checks if the current page URL contains the 'home' string

    console.log('Login successfull')
});
