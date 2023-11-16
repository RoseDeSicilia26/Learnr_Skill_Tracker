

INSERT INTO users (email, password, userType, firstName, lastName, bio, school, interests, position, sex, isAdmin) VALUES
('joey@mentor.com', 'password', 'mentee', 'Joey', 'Clark', 'Excited new intern', 'South Tech University', 'Web Development, Teaching', 'Senior Developer', 'Male', 0);

UPDATE users
SET userType = 'mentor'
WHERE email = 'admin@admin.com';

select * from users where email = 'joey@mentee.com';

SELECT users.firstName AS mentee_name, 
users.email AS mentee_email, 
pathways.pathwayDescription AS pathway_description, 
pathways.skill AS pathway_name, 
pathways.numberOfSteps AS number_of_steps, 
menteepathways.step AS current_step 
FROM relationships 
JOIN menteepathways ON relationships.menteeEmail = menteepathways.menteeEmail 
JOIN pathways ON menteepathways.pathwayID = pathways.pathwayID 
JOIN users ON relationships.menteeEmail = users.email 
WHERE relationships.mentorEmail = "amelia@mentor.com";

SELECT 
    users.firstName AS mentee_name, 
    pathways.pathwayDescription AS pathway_description, 
    pathways.skill AS pathway_name, 
    pathways.numberOfSteps AS number_of_steps, 
    menteepathways.step AS current_step 
FROM 
    relationships 
JOIN 
    menteepathways ON relationships.menteeEmail = menteepathways.menteeEmail 
JOIN 
    pathways ON menteepathways.pathwayID = pathways.pathwayID 
JOIN 
    users ON relationships.menteeEmail = users.email 
WHERE 
    relationships.mentorEmail = "ava@mentor.com";
    
    
select * from users where email = 'admin@admin.com';
