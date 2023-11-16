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

// get all pathways associated to user
exports.getUserPathways = (menteeUsername, callback) => { 

    let found = false;
    // const retrieveQuery = 'SELECT * FROM menteepathways WHERE menteeUsername = ?';

    const retrieveQuery = 'SELECT pathways.skill AS pathway_name, pathways.numberOfSteps AS number_of_steps, menteepathways.step AS current_step FROM pathways JOIN menteepathways ON pathways.pathwayID = menteepathways.pathwayID WHERE menteepathways.menteeUsername = ?';
    

    connection.query(retrieveQuery, menteeUsername, (err, results) => {
        if (err) {
            found = false;
        } 
        else {
            if (results.length>0){
                found = results;
                console.log(results);
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

exports.getPathways = (callback) => {
    let call = false;
    const retrieveQuery = 'SELECT * FROM pathways';

    connection.query(retrieveQuery, (err, results) => {
        if (err){
            console.error('Error Getting Pathways:', err);
        }
        else{
            console.log(results);
            call = true;
            callback(results, call);
        }
    })
}