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

export const userTokenA = Authenticate.authenticateUser(usersWithId[0]);
export const userTokenB = Authenticate.authenticateUser(usersWithId[1]);
export const fakeUserToken = Authenticate.authenticateUser({
    id: 65,
    email: 'fakeuser@fake.com',
    name: 'fake user'
});
