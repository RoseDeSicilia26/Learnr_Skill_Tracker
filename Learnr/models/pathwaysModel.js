const fs = require('fs');
const csv = require('csv-parser');

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

exports.addPathway = (pathwayID, menteeUsername, callback) => {
    const csvLine = `${menteeUsername},${pathwayID},${1}, \n`;
    fs.appendFile('MenteeDashboard.csv', csvLine, (err) => {
        callback(err);
    });
}

exports.checkPathway = (pathwayID, menteeUsername, callback) => {
    let found = false;
    const stream = fs.createReadStream('MenteeDashboard.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.pathwayID === pathwayID && row.username === menteeUsername) {
                console.log('Mentee Pathway Found!');
                found = true;
            }
        })
        .on ('end', () => {
            callback(found); //Returns whether or not the pathway is already assigned to a mentee.
        });
}