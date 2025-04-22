const fs = require('fs');
const path = require('path');

const languagesDir = path.join(__dirname, 'languages');
const settingsDir = path.join(__dirname, 'settings');

function getHighestID() {
    let maxID = 0;
    
    try {
        const files = fs.readdirSync(settingsDir);
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const settingsContent = JSON.parse(fs.readFileSync(path.join(settingsDir, file), 'utf8'));
                const id = settingsContent.Settings.ID;
                if (id > maxID) {
                    maxID = id;
                }
            }
        });
    } catch (error) {
        console.error('Error while getting highest ID:', error);
    }
    
    return maxID;
}

function correctSettings() {
    try {
        const languageFiles = fs.readdirSync(languagesDir)
            .filter(file => file.endsWith('.json'));
        
        const settingsFiles = fs.readdirSync(settingsDir)
            .filter(file => file.endsWith('.json'));
        
        const settingsBasenames = settingsFiles.map(file => path.basename(file, '.json'));
        
        let nextID = getHighestID() + 1;
        
        languageFiles.forEach(languageFile => {
            const baseName = path.basename(languageFile, '.json');
            
            if (!settingsBasenames.includes(baseName)) {
                console.log(`Creating missing settings file for ${languageFile}...`);
                // Since the settings file is created by the corector
                // we need to set the Active flag to false
                const newSettings = {
                    "Settings": {
                        "Path": `./languages/${baseName}.json`,
                        "ID": nextID++,
                        "Default": false,
                        "Active": false
                    }
                };
                
                const settingsFilePath = path.join(settingsDir, `${baseName}.json`);
                fs.writeFileSync(
                    settingsFilePath, 
                    JSON.stringify(newSettings, null, 4), 
                    'utf8'
                );
                
                console.log(`Created settings file: ${settingsFilePath}`);
            }
        });
        
        console.log('Settings correction completed *YPPIE*');
    } catch (error) {
        console.error('Error while correcting settings :( ->', error);
    }
}

correctSettings();