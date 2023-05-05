# ShareBNB Backend

## Checklist

- [ ] Models
    - [X] Listing
        - [X] create
        - [X] findAll
            - [X] _filterWhereBuilder
        - [X] get
        - [X] update
        - [X] remove
    - [ ] User
        - [ ] authenticate
        - [ ] register
        - [X] getAll
        - [X] get
        - [X] update
        - [X] remove
    - [ ] Conversation
        - [ ] create
        - [ ] sendMessage
        - [ ] readMessage
        - [ ] delete

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
    - [X] /upload
        - [X] POST /image
    - [X] /auth
        - [X] POST /register
        - [X] POST /login
    - [X] /users
        - [X] GET /
        - [X] GET /:username
        - [X] PATCH /:username
        - [X] DELETE /:username
    - [ ] /conversations
        - [ ] GET /
        - [ ] GET /? (minPrice, maxPrice, genre)
        - [ ] GET /:id
        - [ ] PATCH /:id
        - [ ] DELETE /:id

## Breaking Changes

- Upload images route is now POST /upload/image
- Start backend server with `nodemon server.js` instead of `nodemon app.js`

## Outstanding

- [ ] Upload image base URL