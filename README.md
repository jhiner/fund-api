# Fund API

API backend for fundraising app. Uses a Mongodb backend.

# Data Model

These are the collections in Mongo:

```

scopes: [create,read,update,delete]:users

fund_users: {
    email: "hinerman@gmail.com",
    displayName: "Justin Hinerman"
}

scopes: [create,read,update,delete]:periods

(lookup)
fund_periods: {
    period_name: "Fall 2016",
    enabled: true
}

(lookup)
fund_categories: {
    category_name: "krispy kreme"
    enabled: true
}

scopes: [create,read,update,delete]:goals

fund_goals: {
    user: "hinerman@gmail.com",
    period: "Fall 2016",
    amount: 100.00
}

scopes: [create,read,update,delete]:goals

fund_items: {
    user: "hinerman@gmail.com",
    category: "krispy kreme",
    amount: 40.00,
    period: "Fall 2016"
}
```


SPA -> auth0/google -> token -> SPA 
- spa now has id_token and token
-> POST the token to /users/create so that it can persist the profile locally


SPA -> Token -> Create user