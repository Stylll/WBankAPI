import Authenticate from '../../src/utils/Authenticate';

export const users = [
    { name: 'James Harden', email: 'james@harden.com' },
    { name: 'Justin Bieber', email: 'justin@bieber.com' },
    { name: 'Nathan Drake', email: 'nathan@drake.com' },
    { name: 'Sam Elliot', email: 'sam@elliot.com' },
]

export const usersWithId = [
    { id: 1, name: 'James Harden', email: 'james@harden.com' },
    { id: 2, name: 'Justin Bieber', email: 'justin@bieber.com' },
    { id: 3, name: 'Nathan Drake', email: 'nathan@drake.com' },
    { id: 4, name: 'Sam Elliot', email: 'sam@elliot.com' },
]

export const customUsers = [
    { id: 777, name: 'Stewie Griffin', email: 'stewie@griffin.com' },
    { id: 504, name: 'Glen Quagmire', email: 'glen@quagmire.com' },
    { id: '002', name: 'Joe Swanson', email: 'joe@swanson.com' },
    { id: 123, name: 'Peter Griffin', email: 'peter@griffin.com' },
    { id: 456, name: 'Lois Griffin', email: 'lois@griffin.com' },
    { id: 219, name: 'John Shark', email: 'john@shark.com' }
]

export const userTokenA = Authenticate.authenticateUser(usersWithId[0]);
export const userTokenB = Authenticate.authenticateUser(usersWithId[1]);
export const fakeUserToken = Authenticate.authenticateUser({
    id: 65,
    email: 'fakeuser@fake.com',
    name: 'fake user'
});
export const customTokenStewie = Authenticate.authenticateUser(customUsers[0]);
export const customTokenGlen = Authenticate.authenticateUser(customUsers[1]);
export const customTokenJoe = Authenticate.authenticateUser(customUsers[2]);
export const customTokenPeter = Authenticate.authenticateUser(customUsers[3]);
export const customTokenLois = Authenticate.authenticateUser(customUsers[4]);
export const customTokenJohn = Authenticate.authenticateUser(customUsers[5]);
