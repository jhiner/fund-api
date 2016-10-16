# Fund API

API backend for fundraising app. Uses a Mongodb backend.

# Configuration

Create app.config.js and set some configuration params:

module.exports = {
     MONGO_URL: (your mongo url)
}

# Data Model

These are the collections in Mongo:

```

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

scopes: [create,read,update,delete]:categories

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

scopes: [create,read,update,delete]:items

fund_items: {
    user: "hinerman@gmail.com",
    category: "krispy kreme",
    amount: 40.00,
    period: "Fall 2016"
}
```

# Notes

SPA -> auth0/google -> token -> SPA 
- spa now has id_token and token
-> POST the token to /users/create so that it can persist the profile locally


SPA -> Token -> Create user



fund.authr.io
fund.authr.io/api




