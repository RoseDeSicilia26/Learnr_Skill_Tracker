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
exports.addPathway = (pathwayID, menteeEmail, step, callback) => { 

    const insertQuery = 'INSERT INTO menteepathways (menteeEmail, pathwayID, step) VALUES (?, ?, ?)';

    connection.query(insertQuery, [menteeEmail, pathwayID, step], (err, results) => {
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