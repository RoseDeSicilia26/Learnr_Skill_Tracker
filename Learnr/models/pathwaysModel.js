const connection = require('./database');


exports.getPathwaySkill = (pathwayID, callback) => {
    let pathSkill;
    const retrieveQuery = 'SELECT skill FROM pathways WHERE ID = ?';

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
exports.addPathway = (pathwayID, menteeUsername, step, callback) => { 

    const insertQuery = 'INSERT INTO menteepathways (menteeUsername, pathwayID, step) VALUES (?, ?, ?)';

    connection.query(insertQuery, [menteeUsername, pathwayID, step], (err, results) => {
        if (err) {
            console.error('Error adding pathway: ', err);
        } 
        
        callback(err);
    });
}

//Checks to see if the pathway + mentee does not already exist in the csv file.
exports.checkPathway = (pathwayID, menteeUsername, callback) => { 

    let found = false;
    const retrieveQuery = 'SELECT * FROM menteepathways WHERE menteeUsername = ? AND pathwayID = ?';

    connection.query(retrieveQuery, [menteeUsername, pathwayID], (err, results) => {
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

exports.validatePathwayID = (pathwayID, callback) => { 

    const retrieveQuery = 'SELECT * FROM pathways WHERE ID = ?';

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