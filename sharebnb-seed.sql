-- Users
INSERT INTO users (username, password, first_name, last_name, email)
VALUES  ('testuser1',
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
VALUES  ('Serene Forest Camp', 'An immersive camping experience in the middle of a tranquil forest', 80, '123 Pine St', 'Asheville', 'NC', '28801', 'Camping Ground', 3),
        ('Beach Side Picnic Spot', 'Picnic spot on a secluded beach with stunning ocean view', 120, '456 Ocean Dr', 'Key West', 'FL', '33040', 'Beach', 3),
        ('Urban Rooftop Garden', 'Rooftop garden with an open space for small gatherings', 150, '789 Urban Ave', 'San Francisco', 'CA', '94101', 'Rooftop Garden', 3),
        ('Mountain Hiking Trail', 'An exclusive access to a challenging mountain hiking trail', 60, '111 Mountain Rd', 'Boulder', 'CO', '80302', 'Hiking Trail', 4),
        ('Lake-side Fishing Dock', 'Private dock by the lake, perfect for a quiet fishing day', 130, '222 Lake St', 'Lake Tahoe', 'CA', '96145', 'Lake', 4),
        ('Desert Campsite', 'An adventurous camping site in the heart of a desert', 90, '333 Desert Blvd', 'Tucson', 'AZ', '85701', 'Desert Camp', 4),
        ('Sunny Vineyard', 'Stroll, sip and savor in our sun-kissed vineyard', 200, '444 Vine Ln', 'Napa', 'CA', '94558', 'Vineyard', 3),
        ('Private Island', 'Experience the ultimate privacy on this lush private island', 500, '555 Island Rd', 'Key Largo', 'FL', '33037', 'Island', 4);


-- Conversations
INSERT INTO conversations (renter_id, owner_id, listing_id)
VALUES  (1, 3, 1),
        (1, 3, 2),
        (1, 4, 4),
        (1, 4, 5),
        (2, 3, 1),
        (2, 3, 3),
        (2, 4, 6),
        (2, 4, 7);

-- Messages
INSERT INTO messages (conversation_id, sender_id, body, sent_at)
VALUES  (1, 1, 'Hi, is the cozy apartment available for rent?', '2023-05-01 10:00:00'),
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
INSERT INTO bookings (listing_id, start_date, end_date, guest_id)
VALUES  (1, '2023-06-01', '2023-06-02', 2),
        (2, '2023-06-03', '2023-06-04', 1),
        (3, '2023-06-05', '2023-06-06', 4),
        (4, '2023-06-07', '2023-06-08', 3),
        (5, '2023-06-09', '2023-06-10', 6),
        (6, '2023-06-11', '2023-06-12', 5),
        (7, '2023-06-13', '2023-06-14', 8),
        (8, '2023-06-15', '2023-06-16', 7);


-- Bookable_days
INSERT INTO bookable_days (day, available, listing_id)
VALUES  ('2023-06-01', TRUE, 1),
        ('2023-06-02', TRUE, 1),
        ('2023-06-03', FALSE, 1),
        ('2023-06-04', TRUE, 1),
        ('2023-06-01', TRUE, 2),
        ('2023-06-02', FALSE, 2),
        ('2023-06-03', TRUE, 2),
        ('2023-06-04', TRUE, 2),
        ('2023-06-05', TRUE, 3),
        ('2023-06-06', TRUE, 3),
        ('2023-06-07', FALSE, 3),
        ('2023-06-08', TRUE, 3),
        ('2023-06-05', TRUE, 4),
        ('2023-06-06', FALSE, 4),
        ('2023-06-07', TRUE, 4),
        ('2023-06-08', TRUE, 4),
        ('2023-06-09', TRUE, 5),
        ('2023-06-10', TRUE, 5),
        ('2023-06-11', FALSE, 5),
        ('2023-06-12', TRUE, 5),
        ('2023-06-09', TRUE, 6),
        ('2023-06-10', FALSE, 6),
        ('2023-06-11', TRUE, 6),
        ('2023-06-12', TRUE, 6),
        ('2023-06-13', TRUE, 7),
        ('2023-06-14', TRUE, 7),
        ('2023-06-15', FALSE, 7),
        ('2023-06-16', TRUE, 7),
        ('2023-06-13', TRUE, 8),
        ('2023-06-14', FALSE, 8),
        ('2023-06-15', TRUE, 8),
        ('2023-06-16', TRUE, 8);

-- Photos
INSERT INTO photos (listing_id, photo_url)
VALUES  (1, 'listing1_photo1.jpg'),
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