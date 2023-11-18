const connection = require('./database');

exports.getPathwaySkill = (pathwayID, callback) => {
    let pathSkill;
    const retrieveQuery = 'SELECT skill FROM pathways WHERE pathwayID = ?';

    connection.query(retrieveQuery, pathwayID, (err, results) => {
        if (err) {
            console.error('Error getting pathway: ', err);
        } 
        else {
            if (results.length>0){
                pathSkill = results[0];
            }

            callback(pathSkill);
        }
    });
}

//Adds a pathway with a mentee to the csv file.
exports.addPathway = (pathwayID, menteeEmail, callback) => { 

    const insertQuery = 'INSERT INTO menteepathways (menteeEmail, pathwayID, step) VALUES (?, ?, ?)';

    connection.query(insertQuery, [menteeEmail, pathwayID, 0], (err, results) => {
        if (err) {
            console.error('Error adding pathway: ', err);
        } 
        
        callback(err);
    });
}

//Checks to see if the pathway + mentee does not already exist in the csv file.
exports.checkPathway = (pathwayID, menteeEmail, callback) => { 

    let found = false;
    const retrieveQuery = 'SELECT * FROM menteepathways WHERE menteeEmail = ? AND pathwayID = ?';

    connection.query(retrieveQuery, [menteeEmail, pathwayID], (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = true;
            }
        }
        callback(found);
    });    
}
// get all mentees associated to mentor
exports.getMentorMentees = (mentorEmail, callback) => { 

    let found = false;

    const retrieveQuery = 'SELECT users.firstName AS mentee_name, pathways.pathwayDescription AS pathway_description, pathways.skill AS pathway_name, pathways.numberOfSteps AS number_of_steps, menteepathways.step AS current_step FROM relationships JOIN menteepathways ON relationships.menteeEmail = menteepathways.menteeEmail JOIN pathways ON menteepathways.pathwayID = pathways.pathwayID JOIN users ON relationships.menteeEmail = users.email WHERE relationships.mentorEmail = ?';

    connection.query(retrieveQuery, mentorEmail, (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = results;
            }
            else {
                found = false;
            }
        }
        callback(found);
    });    
}

// get all pathways associated to user
exports.getMenteePathwaysAll = (menteeEmail, callback) => { 

    let found = false;
    // const retrieveQuery = 'SELECT * FROM menteepathways WHERE menteeUsername = ?';

    const retrieveQuery = 'SELECT pathways.pathwayDescription as pathway_description, pathways.skill AS pathway_name, pathways.numberOfSteps AS number_of_steps, menteepathways.step AS current_step, pathways.pathwayID as pathway_id FROM pathways JOIN menteepathways ON pathways.pathwayID = menteepathways.pathwayID WHERE menteepathways.menteeEmail = ?';
    

    connection.query(retrieveQuery, menteeEmail, (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = results;
            }
            else {
                found = false;
            }
        }
        callback(found);
    });    
}

// get single pathway associated to user
exports.getMenteePathwaysSingle = (menteeEmail, pathway_id, callback) => { 

    let found = false;
    // const retrieveQuery = 'SELECT * FROM menteepathways WHERE menteeUsername = ?';

    const retrieveQuery = 'SELECT pathways.skill AS pathway_name, pathways.numberOfSteps AS number_of_steps, menteepathways.step AS current_step FROM pathways JOIN menteepathways ON pathways.pathwayID = menteepathways.pathwayID WHERE menteepathways.menteeEmail = ? and pathways.pathwayID = ?';
    

    connection.query(retrieveQuery, [menteeEmail, pathway_id], (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = results;
            }
        }
        callback(found);
    });    
}

// get all pathways associated to user
exports.getPathwaySkills = (pathwayID, callback) => { 

    let found = false;
    const retrieveQuery = 'SELECT * FROM pathways WHERE pathwayID = ?';

    connection.query(retrieveQuery, pathwayID, (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = results;
            }
        }
        callback(found);
    });    
}

exports.validatePathwayID = (pathwayID, callback) => { 

    const retrieveQuery = 'SELECT * FROM pathways WHERE pathwayID = ?';

    connection.query(retrieveQuery, pathwayID, (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = true;
            }

            callback(found);
        }
    }); 
}

exports.removePathway = (pathwayID, callback) => {
    const removePathwayQuery = 'DELETE FROM menteepathways WHERE pathwayID = ?';

    connection.query(removePathwayQuery, pathwayID, (err, results) => {
        if (err) {
            console.error('Error Removing Pathway from menteePathways:', err);
            callback(false); // Call the callback with an error indicator
        } else {
            callback(true);  // Call the callback indicating success
        }
    });
};

exports.disablePathway = (pathwayID, callback) => {
    const isEnabled = 0;
    const updateQuery = 'UPDATE pathways SET isEnabled = ? WHERE pathwayID = ?';

    connection.query(updateQuery, [isEnabled, pathwayID], (err, results) => {
        if (err) {
            console.error('Error Removing Pathway:', err);
            callback(false); // Call the callback with an error indicator
        } else {
            callback(true);  // Call the callback indicating success
        }
    });
};

exports.enablePathway = (pathwayID, callback) => {
    const isEnabled = 1;
    const updateQuery = 'UPDATE pathways SET isEnabled = ? WHERE pathwayID = ?';

    connection.query(updateQuery, [isEnabled, pathwayID], (err, results) => {
        if (err) {
            console.error('Error Removing Pathway:', err);
            callback(false); // Call the callback with an error indicator
        } else {
            callback(true);  // Call the callback indicating success
        }
    });
};

exports.getEnabledPathways = (callback) => {
    let call = false;
    const retrieveQuery = 'SELECT * FROM pathways WHERE isEnabled = ?';

    connection.query(retrieveQuery, 1, (err, results) => {
        if (err){
            console.error('Error Getting Pathways:', err);
        }
        else{
            call = true;
            callback(results, call);
        }
    });
}

exports.getDisabledPathways = (callback) => {
    let call = false;
    const retrieveQuery = 'SELECT * FROM pathways WHERE isEnabled = ?';

    connection.query(retrieveQuery, 0, (err, results) => {
        if (err){
            console.error('Error Getting Pathways:', err);
        }
        else{
            call = true;
            callback(results, call);
        }
    });
}

exports.getMenteePathways = (menteeEmail, callback) => {

    const retrieveQuery = 'SELECT menteepathways.menteeEmail, pathways.skill FROM menteepathways JOIN pathways ON menteepathways.pathwayID = pathways.pathwayID WHERE menteepathways.menteeEmail = ?';

    connection.query(retrieveQuery, menteeEmail, (err, results) => {
        if (err){
            console.error('Error Getting Users:', err);
        }
        else{
            callback(results);
        }
    });

}

exports.getPathwaySteps = (skill, callback) => {
    const retrieveQuery = 'SELECT * FROM pathways WHERE skill = ?';

    connection.query(retrieveQuery, skill, (err, results) =>{
        if(err){
            console.error('Error getting steps:', err);
        }
        else{
            const numberOfSteps = results[0] ? results[0].numberOfSteps : null;
            callback(numberOfSteps);
        }
    });
}

exports.getPathwayID = (skill, callback) => {
    const retrieveQuery = 'SELECT * FROM pathways WHERE skill = ?';

    connection.query(retrieveQuery, skill, (err, results) =>{
        if(err){
            console.error('Error getting steps:', err);
        }
        else{
            const pathwayId = results[0] ? results[0].pathwayID : null;
            callback(pathwayId);
        }
    });
}

exports.createPathway = (pathwayName, numberOfSteps, pathwayDescription, callback) => {
    console.log(pathwayName, numberOfSteps, pathwayDescription);
    const insertQuery = 'INSERT INTO pathways (skill, numberOfSteps, pathwayDescription) VALUES (?, ?, ?)';

    connection.query(insertQuery, [pathwayName, numberOfSteps, pathwayDescription], (err, results) =>{
        if(err){
            console.error('Error Adding Pathway:', err);
            callabck(false);
        }
        else{
            callback(true);
        }
    });
}