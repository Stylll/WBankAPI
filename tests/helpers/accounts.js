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

export const customAccounts = [
    { id: 1234, name: 'stewie account', accountTypeId: 1, openingBalance: 100, accountNo: '1234' },
    { id: 2001, name: 'glen account', accountTypeId: 1, openingBalance: 35000, accountNo: '2001' },
    { id: 1010, name: 'joe account', accountTypeId: 1, openingBalance: 7425, accountNo: '1010' },
    { id: 5500, name: 'joe account two', accountTypeId: 1,
        openingBalance: 15000, accountNo: '5500' },
    { id: '0123', name: 'peter account', accountTypeId: 1,
        openingBalance: 150, accountNo: '0123' },
    { id: '0456', name: 'lois account', accountTypeId: 1, openingBalance: 65000, accountNo: '0456' }
]

export const customAccountCustomers = [
    { accountId: 1234, customerId: 777 },
    { accountId: 2001, customerId: 504 },
    { accountId: 1010, customerId: '002' },
    { accountId: 5500, customerId: '002' },
    { accountId: '0123', customerId: 123 },
    { accountId: '0456', customerId: 456 },
]

export const customTransactions = [
    { accountId: 1234, credit: 100, debit: 0, customerId: 777 },
    { accountId: 2001, credit: 35000, debit: 0, customerId: 504 },
    { accountId: 1010, credit: 7425, debit: 0, customerId: '002' },
    { accountId: 5500, credit: 15000, debit: 0, customerId: '002' },
    { accountId: '0123', credit: 150, debit: 0, customerId: 123 },
    { accountId: '0456', credit: 65000, debit: 0, customerId: 456 },
]

export const transactions = [
    { accountId: 1, credit: 1000, debit: 0, customerId: 1 },
    { accountId: 2, credit: 1000, debit: 0, customerId: 1 },
    { accountId: 3, credit: 1000, debit: 0, customerId: 2 },
    { accountId: 1, credit: 500, debit: 0, customerId: 1 }
]
