-- Users
INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User1',
        'testuser1@example.com'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User2',
        'testuser2@example.com'),
       ('testowner1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Owner1',
        'testowner1@example.com'),
       ('testowner2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Owner2',
        'testowner2@example.com');

-- Listings
INSERT INTO listings (name, description, price, street, city, state, zip, genre, owner_id)
VALUES ('Cozy Apartment', 'A beautiful and cozy apartment in the heart of the city', 100, '123 Main St', 'New York', 'NY', '10001', 'Apartment', 3),
       ('Beach House', 'Gorgeous beach house with a stunning ocean view', 250, '456 Ocean Dr', 'Miami', 'FL', '33139', 'House', 3),
       ('Modern Loft', 'Spacious modern loft in the city center', 150, '789 City Center', 'Los Angeles', 'CA', '90001', 'Loft', 3),
       ('Mountain Cabin', 'Cozy mountain cabin with a breathtaking view', 200, '111 Mountain Rd', 'Denver', 'CO', '80202', 'Cabin', 4),
       ('Lake House', 'Beautiful lake house with a private dock', 300, '222 Lake St', 'Seattle', 'WA', '98101', 'House', 4),
       ('Penthouse Suite', 'Luxurious penthouse suite with amazing city views', 500, '333 Skyline Blvd', 'San Francisco', 'CA', '94102', 'Apartment', 4),
       ('Country Cottage', 'Charming country cottage surrounded by nature', 175, '444 Country Ln', 'Austin', 'TX', '78701', 'Cottage', 4),
       ('Desert Villa', 'Elegant desert villa with a private pool', 350, '555 Desert Blvd', 'Phoenix', 'AZ', '85001', 'Villa', 3);

-- Conversations
INSERT INTO conversations (renter_id, owner_id, listing_id)
VALUES (1, 3, 1),
       (1, 3, 2),
       (1, 4, 4),
       (1, 4, 5),
       (2, 3, 1),
       (2, 3, 3),
       (2, 4, 6),
       (2, 4, 7);

-- Messages
INSERT INTO messages (conversation_id, sender_id, body, sent_at)
VALUES (1, 1, 'Hi, is the cozy apartment available for rent?', '2023-05-01 10:00:00'),
       (1, 3, 'Yes, it is available. When would you like to book?', '2023-05-01 10:30:00'),
       (2, 1, 'Is the beach house available next month?', '2023-05-01 11:00:00'),
       (2, 3, 'Yes, it is available. Please let me know the dates.', '2023-05-01 11:30:00'),
       (3, 1, 'Are there any available dates for the mountain cabin?', '2023-05-01 12:00:00'),
       (3, 4, 'Yes, there are available dates. Can you please specify when you would like to book?', '2023-05-01 12:30:00'),
       (4, 1, 'Can I book the lake house for a weekend?', '2023-05-01 13:00:00'),
       (4, 4, 'Yes, the lake house is available for weekends. Please let me know which weekend you prefer.', '2023-05-01 13:30:00'),
       (5, 2, 'Hello, I am interested in the cozy apartment. Is it available next week?', '2023-05-01 14:00:00'),
       (5, 3, 'Yes, the cozy apartment is available next week. Please let me know the exact dates.', '2023-05-01 14:30:00'),
       (6, 2, 'I would like to book the modern loft. Is it available?', '2023-05-01 15:00:00'),
       (6, 3, 'Yes, the modern loft is available. When would you like to book?', '2023-05-01 15:30:00'),
       (7, 2, 'Is the penthouse suite available for rent?', '2023-05-01 16:00:00'),
       (7, 4, 'Yes, it is available. When would you like to book?', '2023-05-01 16:30:00'),
       (8, 2, 'Can I rent the country cottage for a week?', '2023-05-01 17:00:00'),
       (8, 4, 'Yes, the country cottage is available for a week. Please let me know the dates.', '2023-05-01 17:30:00');

-- Bookings
INSERT INTO bookings (owner_id, renter_id, listing_id, created_at)
VALUES (3, 1, 1, '2023-05-02 12:00:00'),
       (3, 2, 2, '2023-05-02 13:00:00'),
       (3, 2, 3, '2023-05-02 14:00:00'),
       (4, 1, 4, '2023-05-02 15:00:00'),
       (4, 1, 5, '2023-05-02 16:00:00'),
       (4, 2, 6, '2023-05-02 17:00:00'),
       (4, 2, 7, '2023-05-02 18:00:00');

-- Bookable_days
INSERT INTO bookable_days (day, available, listing_id)
VALUES ('2023-05-10', TRUE, 1),
       ('2023-05-11', TRUE, 1),
       ('2023-05-12', FALSE, 1),
       ('2023-05-13', TRUE, 1),
       ('2023-05-10', TRUE, 2),
       ('2023-05-11', FALSE, 2),
       ('2023-05-12', TRUE, 2),
       ('2023-05-13', TRUE, 2),
       ('2023-05-14', TRUE, 3),
       ('2023-05-15', TRUE, 3),
       ('2023-05-16', FALSE, 3),
       ('2023-05-17', TRUE, 3),
       ('2023-05-14', TRUE, 4),
       ('2023-05-15', FALSE, 4),
       ('2023-05-16', TRUE, 4),
       ('2023-05-17', TRUE, 4),
       ('2023-05-18', TRUE, 5),
       ('2023-05-19', TRUE, 5),
       ('2023-05-20', FALSE, 5),
       ('2023-05-21', TRUE, 5),
       ('2023-05-18', TRUE, 6),
       ('2023-05-19', FALSE, 6),
       ('2023-05-20', TRUE, 6),
       ('2023-05-21', TRUE, 6),
       ('2023-05-22', TRUE, 7),
       ('2023-05-23', TRUE, 7),
       ('2023-05-24', FALSE, 7),
       ('2023-05-25', TRUE, 7),
       ('2023-05-22', TRUE, 8),
       ('2023-05-23', FALSE, 8),
       ('2023-05-24', TRUE, 8),
       ('2023-05-25', TRUE, 8);

-- Photos
INSERT INTO photos (listing_id, photo_url)
VALUES (1, 'listing1_photo1.jpg'),
       (1, 'listing1_photo2.jpg'),
       (2, 'listing2_photo1.jpg'),
       (2, 'listing2_photo2.jpg'),
       (3, 'listing3_photo1.jpg'),
       (3, 'listing3_photo2.jpg'),
       (4, 'listing4_photo1.jpg'),
       (4, 'listing4_photo2.jpg'),
       (5, 'listing5_photo1.jpg'),
       (5, 'listing5_photo2.jpg'),
       (6, 'listing6_photo1.jpg'),
       (6, 'listing6_photo2.jpg'),
       (7, 'listing7_photo1.jpg'),
       (7, 'listing7_photo2.jpg'),
       (8, 'listing8_photo1.jpg'),
       (8, 'listing8_photo2.jpg');