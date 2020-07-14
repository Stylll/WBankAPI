export const accountsWithId = [
    { id: 1, name: 'My Account 1', accountTypeId: 1, openingBalance: 1000, accountNo: '0001' },
    { id: 2, name: 'My Account 2', accountTypeId: 1, openingBalance: 1000, accountNo: '0002' },
    { id: 3, name: 'My Account 3', accountTypeId: 1, openingBalance: 1000, accountNo: '0003' }
]

export const accountCustomers = [
    { accountId: 1, customerId: 1 },
    { accountId: 2, customerId: 1 },
    { accountId: 3, customerId: 2 },
]

export const transactions = [
    { accountId: 1, credit: 1000, debit: 0, customerId: 1 },
    { accountId: 2, credit: 1000, debit: 0, customerId: 1 },
    { accountId: 3, credit: 1000, debit: 0, customerId: 2 },
    { accountId: 1, credit: 500, debit: 0, customerId: 1 }
]
