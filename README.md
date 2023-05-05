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
    - [X] User
        - [X] authenticate
        - [X] register
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
        - [X] authenticateJWT
        - [X] isLoggedIn
        - [ ] isListingOwner (not sure if this is middleware)
        - [X] isCorrectUser
        - [ ] isInConversation (not sure if this is middleware)

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
- Image upload is technically optional

## Outstanding

- [ ] Upload image still adds full AWS URL to database
- [ ] Need to implement conversation routes / functionality
- [ ] Add checks for correct listing owner (not sure if this is middleware)
- [ ] Add checks for in conversation (not sure if this is middleware)