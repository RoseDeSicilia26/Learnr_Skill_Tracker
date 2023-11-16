UPDATE `users`
SET `bio` = "no bio for me" 
WHERE `Email` = 'mentor1';

UPDATE `users`
SET `school` = "some school in Miami"
WHERE `Email` = 'mentor1';

UPDATE `users`
SET `interests` = "doing stuff"
WHERE `Email` = 'mentor1';

UPDATE `users`
SET `bio` = "yes, i have a bio" 
WHERE `Email` = 'mentor2';

UPDATE `users`
SET `school` = "Miami works"
WHERE `Email` = 'mentor2';

UPDATE `users`
SET `interests` = "sadly, web development."
WHERE `Email` = 'mentor2';



SELECT *
FROM `users`
WHERE `firstName` IS NOT NULL;


INSERT INTO pathways (pathwayID, skill, numberOfSteps, pathwayDescription) VALUES
(1, 'Front-End Development', 5, 'This pathway covers HTML, CSS, JavaScript, and frameworks like React or Angular for front-end web development.'),
(2, 'Back-End Development', 5, 'Focuses on server-side development, databases, and scripting languages like Node.js, Python, or Java.'),
(3, 'Full-Stack Development', 7, 'Covers both front-end and back-end development skills for a comprehensive understanding of web development.'),
(4, 'Data Structures and Algorithms', 6, 'Essential for problem-solving, covering basic to advanced data structures and algorithms.'),
(5, 'DevOps and Cloud Computing', 7, 'Explores DevOps practices, cloud services (AWS, Azure, GCP), and CI/CD pipelines.'),
(6, 'Mobile App Development', 5, 'Covers development for Android and iOS platforms, including native and cross-platform solutions.'),
(7, 'Cybersecurity', 6, 'Focuses on security principles, network security, and ethical hacking techniques.'),
(8, 'AI and Machine Learning', 7, 'Covers fundamentals of AI, machine learning algorithms, deep learning, and data analysis.');



INSERT INTO users (email, password, userType, firstName, lastName, bio, school, interests, position, sex, isAdmin) VALUES
('emma@mentor.com', 'password', 'mentor', 'Emma', 'Clark', 'Senior software engineer with 10 years of experience in web development.', 'Tech University', 'Web Development, Teaching', 'Senior Developer', 'Female', 0),
('noah@mentor.com', 'password', 'mentor', 'Noah', 'Allen', 'Data science mentor with a focus on AI and machine learning.', 'Data Science Institute', 'Machine Learning, AI', 'Data Scientist', 'Male', 0),
('ava@mentor.com', 'password', 'mentor', 'Ava', 'Thompson', 'Experienced in mobile app development, both Android and iOS.', 'Mobile Dev Academy', 'Mobile Apps, UI/UX', 'Mobile Developer', 'Female', 0);

INSERT INTO users (email, password, userType, firstName, lastName, bio, school, interests, position, sex, isAdmin) VALUES
('admin@admin.com', 'password', 'mentor', 'James', 'Smith', 'System administrator with extensive experience in network security and management.', 'Tech University', 'Network Security, System Administration', 'System Administrator', 'Male', 1);


INSERT INTO users (email, password, userType, firstName, lastName, bio, school, interests, position, sex, isAdmin) VALUES
('jack@mentee.com', 'password', 'mentee', 'Jack', 'White', 'Aspiring front-end developer, passionate about web design.', 'Web Dev College', 'Web Design, JavaScript', 'Student', 'Male', 0),
('sophia@mentee.com', 'password', 'mentee', 'Sophia', 'Martin', 'Junior developer focusing on Python and backend technologies.', 'Tech High School', 'Python, Backend Development', 'Student', 'Female', 0),
('mia@mentee.com', 'password', 'mentee', 'Mia', 'Lopez', 'Interested in machine learning and data analysis.', 'University of Tech', 'Machine Learning, Data Science', 'Student', 'Female', 0),
('lucas@mentee.com', 'password', 'mentee', 'Lucas', 'Gonzalez', 'Enthusiastic about cybersecurity and ethical hacking.', 'Cybersecurity Academy', 'Cybersecurity, Ethical Hacking', 'Student', 'Male', 0),
('isabella@mentee.com', 'password', 'mentee', 'Isabella', 'Rossi', 'Junior graphic designer and aspiring UI/UX artist.', 'Design Institute', 'Graphic Design, UI/UX', 'Intern', 'Female', 0),
('mason@mentee.com', 'password', 'mentee', 'Mason', 'Hughes', 'Computer science student with a focus on cloud computing.', 'Tech University', 'Cloud Computing, AWS', 'Student', 'Male', 0),
('olivia@mentee.com', 'password', 'mentee', 'Olivia', 'Murphy', 'Aspiring software engineer with a passion for game development.', 'Gaming Tech School', 'Game Development, C++', 'Student', 'Female', 0),
('logan@mentee.com', 'password', 'mentee', 'Logan', 'Davis', 'Dedicated to learning full-stack web development.', 'Full-Stack Academy', 'Full-Stack Development, JavaScript', 'Student', 'Male', 0),
('amelia@mentee.com', 'password', 'mentee', 'Amelia', 'Garcia', 'Computer engineering student interested in hardware and IoT.', 'Engineering College', 'Hardware Engineering, IoT', 'Student', 'Female', 0),
('ethan@mentee.com', 'password', 'mentee', 'Ethan', 'Martinez', 'Focused on AI and robotics, with a keen interest in Python programming.', 'Robotics Institute', 'Artificial Intelligence, Robotics', 'Student', 'Male', 0);

INSERT INTO relationships (mentorEmail, menteeEmail) VALUES
('emma@mentor.com', 'jack@mentee.com'),
('emma@mentor.com', 'sophia@mentee.com'),
('emma@mentor.com', 'lucas@mentee.com'),
('noah@mentor.com', 'isabella@mentee.com'),
('noah@mentor.com', 'mason@mentee.com'),
('noah@mentor.com', 'olivia@mentee.com'),
('ava@mentor.com', 'logan@mentee.com'),
('ava@mentor.com', 'amelia@mentee.com'),
('ava@mentor.com', 'ethan@mentee.com');

INSERT INTO menteepathways (menteeEmail, pathwayID, step) VALUES
('jack@mentee.com', 1, 1),
('sophia@mentee.com', 2, 1),
('lucas@mentee.com', 4, 1),
('isabella@mentee.com', 1, 1),
('mason@mentee.com', 2, 1),
('olivia@mentee.com', 5, 1),
('logan@mentee.com', 1, 1),
('amelia@mentee.com', 2, 1),
('ethan@mentee.com', 6, 1);


UPDATE menteepathways
SET step = 4
WHERE menteeEmail = 'amelia@mentee.com';
