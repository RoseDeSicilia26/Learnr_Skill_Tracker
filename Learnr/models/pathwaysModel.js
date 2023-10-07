//Handles all data relating to pathways.
const fs = require('fs');
const csv = require('csv-parser');

//Returns the skill of a pathway.
exports.getPathway = (pathwayID, callback) => { 
    var skill;
    const stream = fs.createReadStream('Pathway.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.pathwayID === pathwayID) {
                skill = row.pathwayName;
            }
        })
        .on ('end', () => {
            callback(skill); //Returns the name of the pathway's skill
        });
}

//Adds a pathway with a mentee to the csv file.
exports.addPathway = (pathwayID, menteeUsername, callback) => { 
    const csvLine = `${menteeUsername},${pathwayID},${1}, \n`;
    fs.appendFile('MenteeDashboard.csv', csvLine, (err) => {
        callback(err);
    });
}

//Checks to see if the pathway + mentee does not already exist in the csv file.
exports.checkPathway = (pathwayID, menteeUsername, callback) => { 
    let found = false;
    const stream = fs.createReadStream('MenteeDashboard.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.pathwayID === pathwayID && row.username === menteeUsername) {
                found = true;
            }
        })
        .on ('end', () => {
            callback(found); //Returns the name of the pathway's skill
        });
        
}

exports.validatePathwayID = (pathwayID, callback) => { 
    let found = false;
    const stream = fs.createReadStream('Pathway.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.pathwayID === pathwayID) {
                found = true;
            }
        })
        .on ('end', () => {
            callback(found); //Returns the name of the pathway's skill
        });
        
}