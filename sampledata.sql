USE ritcs;

-- users
INSERT INTO users (id, username, password, role, amountDonated) VALUES
(4, 'admin', 'admin0214', 'admin', 0.00),
(5, 'miraya1234', '1234', 'user', 22659.00);

-- needs
INSERT INTO needs (id, title, description, category, priority, timeSensitive, contactInfo, createdAt, amountDonated, amountNeeded, adminID, closed) VALUES
(1, 'Emergency Food Parcels', 'Distributing essential food boxes to families facing food insecurity.', 'Food', 'high', 1, 'relief@foodhand.org', '2025-11-01 00:00:00', 1262.00, 3000.00, 4, NULL),
(2, 'Community Soup Kitchen Supplies', 'Supporting weekly meal services for low-income residents.', 'Food', 'medium', 0, 'kitchen@helpinghands.org', '2025-10-21 00:00:00', 120.00, 1500.00, 4, NULL),
(3, 'School Uniform Support Program', 'Providing school uniforms for students whose families cannot afford them.', 'Clothing', 'medium', 0, 'contact@edusupport.org', '2025-09-14 00:00:00', 200.00, 1800.00, 4, NULL),
(4, 'Winter Coat Drive', 'Collecting and distributing insulated coats for homeless individuals.', 'Clothing', 'high', 1, 'warmth@carehub.org', '2025-11-03 00:00:00', 2500.00, 2500.00, 4, 1),
(5, 'Temporary Shelter Vouchers', 'Providing temporary hotel vouchers for families displaced by eviction.', 'Shelter', 'high', 1, 'housing@hopebridge.org', '2025-11-07 00:00:00', 6930.00, 7000.00, 4, NULL),
(6, 'Community Housing Repairs', 'Repairing deteriorating homes belonging to elderly residents.', 'Shelter', 'medium', 0, 'repair@homeaid.org', '2025-08-22 00:00:00', 600.00, 5500.00, 4, NULL),
(7, 'Essential Medicines Fund', 'Subsidizing essential prescription medications for uninsured patients.', 'Medical', 'high', 1, 'care@medassist.org', '2025-11-05 00:00:00', 5200.00, 6500.00, 4, NULL),
(8, 'Wheelchair Accessibility Equipment', 'Installing ramps and providing wheelchairs to disabled residents.', 'Medical', 'medium', 0, 'support@mobilityaid.org', '2025-09-30 00:00:00', 700.00, 5000.00, 4, NULL),
(9, 'Mobile Health Clinic', 'Operational support for a mobile clinic serving rural communities.', 'Medical', 'high', 0, 'clinic@healthreach.org', '2025-07-19 00:00:00', 2500.00, 12000.00, 4, NULL),
(10, 'Primary School Book Resupply', 'Replacing outdated and damaged books in underfunded schools.', 'Education', 'low', 0, 'library@readforward.org', '2025-08-12 00:00:00', 80.00, 1400.00, 4, NULL),
(11, 'Teacher Training Workshops', 'Providing professional development training for rural school teachers.', 'Education', 'medium', 0, 'training@learnuplift.org', '2025-10-04 00:00:00', 450.00, 3800.00, 4, NULL),
(12, 'After-School Tutoring Program', 'Supporting tutoring services for students struggling academically.', 'Education', 'medium', 0, 'support@brightsteps.org', '2025-10-15 00:00:00', 300.00, 2500.00, 4, NULL),
(13, 'Community Garden Initiative', 'Creating shared garden plots to grow nutritious food locally.', 'Other', 'low', 0, 'grow@harvesttogether.org', '2025-09-05 00:00:00', 150.00, 2000.00, 4, NULL),
(14, 'Youth Athletics Equipment', 'Providing sports equipment to underserved youth teams.', 'Other', 'low', 0, 'sports@playtogether.org', '2025-09-28 00:00:00', 100.00, 1600.00, 4, NULL),
(15, 'Stray Animal Medical Treatment', 'Funding treatment and rehabilitation for injured stray animals.', 'Other', 'medium', 1, 'rescue@pawshope.org', '2025-10-05 00:00:00', 350.00, 2200.00, 4, NULL),
(16, 'Flood Relief Housing Kits', 'Supplying waterproof tent kits for families displaced by flooding.', 'Shelter', 'high', 1, 'relief@rapidhelp.org', '2025-11-08 00:00:00', 6000.00, 6000.00, 4, 1),
(17, 'Nutritional Supplements for Children', 'Providing vitamin and protein supplements to malnourished children.', 'Medical', 'high', 1, 'aid@childnutria.org', '2025-11-06 00:00:00', 4000.00, 7000.00, 4, NULL),
(18, 'School Laptop Support Program', 'Providing low-cost laptops to students for remote learning access.', 'Education', 'medium', 0, 'tech@edufuture.org', '2025-10-29 00:00:00', 700.00, 5000.00, 4, NULL),
(19, 'Elderly Home Visit Volunteers', 'Coordinating volunteers to check on isolated senior citizens.', 'Other', 'low', 0, 'care@elderreach.org', '2025-08-14 00:00:00', 40.00, 1200.00, 4, NULL);

-- community_items
INSERT INTO community_items (id, title, description, category, createdAt, volunteersNeeded) VALUES
(2, 'Neighborhood Park Cleanup', 'Join us for a neighborhood park cleanup at Greenleaf Public Park, behind the Riverside Apartments. We will be collecting trash, planting local flowers, repainting benches, and restoring the playground area. We are especially seeking volunteers who can bring gloves, reusable bags, or basic gardening tools. Perfect for students seeking community service hours.', 'Other', '2025-11-10 00:06:27', 0),
(3, 'Clothes Drive for Winter', 'Our Winter Clothes Drive aims to support homeless individuals and low-income families in the city. Please bring gently-used jackets, scarves, gloves, and boots to the donation stand at the Al Maktoum Community Hall lobby. We especially need warm clothing for children ages 4–12 and men’s large sizes. Volunteers will help sort and categorize donations for distribution.', 'Clothing', '2025-11-10 00:06:27', 0),
(4, 'Free Health Checkup Camp', 'A free medical checkup camp will be held at the Sunrise Neighborhood Clinic (Block 4 near Al Jazeera Street) offering basic health screenings such as blood pressure checks, glucose monitoring, and vision tests. We are looking for certified nurses, medical students, and volunteers for registration and line organization. No fees required for patients — services are fully sponsored by community donations.', 'Medical', '2025-11-10 00:06:27', 0),
(5, 'Back-to-School Supplies Giveaway', 'Help local students prepare for the new academic year by contributing to our School Supply Giveaway located at the Eastwood Public Library auditorium. We are collecting notebooks, backpacks, pencils, art supplies, and calculators. Volunteers are needed for packing supply sets and distributing them to families who arrive. Ideal for individuals who enjoy organization and assisting children.', 'Education', '2025-11-10 00:06:27', 0),
(6, 'Community Garden Build', 'We are building a shared community garden on the open lot beside the Westside Youth Center. The goal is to grow seasonal vegetables and herbs that will be free for any family in the community to harvest. Volunteers should be comfortable with outdoor work — tasks include soil mixing, seed planting, and basic carpentry for raised beds. No previous gardening experience required.', 'Other', '2025-11-10 00:06:27', 0),
(7, 'Warm Meals Delivery to Shelters', 'Assist our warm meal delivery team in preparing and distributing freshly cooked meals to several homeless shelters across the city. Food preparation will take place at the Central Community Kitchen (City Hall Annex building). Drivers with their own vehicles are greatly appreciated, but carpool options will be arranged. Volunteers will also help package meals safely and efficiently.', 'Food', '2025-11-10 00:06:27', 0),
(8, 'Youth Tutoring and Mentorship Night', 'We are launching a Youth Tutoring and Mentorship Night held every Wednesday at Old Town Community Learning Center. We are looking for university students, teachers, and professionals willing to tutor subjects such as math, science, language studies, and exam preparation. Mentors will also give informal guidance on future education and career decisions to students aged 12–18.', 'Education', '2025-11-10 00:06:27', 0),
(9, 'Emergency Shelter Support Team', 'Our emergency shelter support group will assist with organizing bedding, hygiene kits, and basic supplies at the Evergreen Temporary Relief Shelter. Volunteers are needed to sort donated blankets, toiletries, and mattresses into labeled storage sections. Part of the team will also help new arrivals get settled and oriented. Compassion, patience, and calm presence are key for this role.', 'Shelter', '2025-11-10 00:06:27', 0),
(10, 'Free Clothing Swap Event', 'We are hosting a free Clothing Swap at the Lakeside Cultural Hall. Participants may bring clothing they no longer need and exchange items freely with others. Volunteers are needed to help receive clothing at the door, inspect items for quality, and create separated sections by size and category. A great way to promote sustainability and reduce textile waste within our community.', 'Clothing', '2025-11-10 00:06:27', 0),
(11, 'asd', 'asd', 'Shelter', '2025-11-10 00:22:40', 0);

-- baskets
INSERT INTO baskets (basketID, userID) VALUES
(1, 5);

-- basket_needs (empty)
-- no data to insert

-- cupboards (empty)
-- no data to insert

-- admin_community_items
INSERT INTO admin_community_items (adminID, communityItemID) VALUES
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(4, 8),
(4, 9),
(4, 10),
(4, 11);

-- user_prefs
INSERT INTO user_prefs (userID, category) VALUES
(4, 'Education');
