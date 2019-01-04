import { Selector, Role } from 'testcafe';

export const regularUser = Role('http://cozy.tools:8080/', async t => {
    await t
        .typeText(Selector('#password'), 'cozy')
        .click(Selector('span').withText('LOG IN'))
});
