# ShareBNB Backend

## Checklist

- [ ] Models
    - [ ] Listing
        - [X] create
        - [X] findAll
            - [X] _filterWhereBuilder
        - [X] get
        - [X] update
        - [X] remove

- [ ] Middleware
    - [ ] auth
        - [ ] isLoggedIn
        - [ ] isListingOwner
        - [ ] isAccountOwner
        - [ ] isInConversation

- [ ] Routes (no auth)
    - [X] /listings
        - [X] POST /
        - [X] GET /
        - [X] GET /? (minPrice, maxPrice, genre)
        - [X] GET /:id
        - [X] PATCH /:id
        - [X] DELETE /:id
    - [ ] /auth
        - [ ] POST /register
        - [ ] POST /login
    - [ ] /users
        - [ ] GET /
        - [ ] GET /:username
        - [ ] PATCH /:username
        - [ ] DELETE /:username
    - [ ] /conversations
        - [ ] GET /
        - [ ] GET /? (minPrice, maxPrice, genre)
        - [ ] GET /:id
        - [ ] PATCH /:id
        - [ ] DELETE /:id

- [ ] Routes (yes auth)
    - [ ] /listings
        - [ ] POST /
        - [ ] GET /
        - [ ] GET /? (minPrice, maxPrice, genre)
        - [ ] GET /:id
        - [ ] PATCH /:id
        - [ ] DELETE /:id
