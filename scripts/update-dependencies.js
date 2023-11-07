const { exec } = require('child_process');

// Befehl zum Installieren von 'npm-check-updates' global
exec('npm i -g npm-check-updates', (error, stdout, stderr) => {
    if (error) {
        console.error(`Fehler: ${error}`);
        return;
    }
    console.log(`Ausgabe: ${stdout}`);
    console.error(`Fehlerausgabe: ${stderr}`);

    // Befehl zum Aktualisieren der Versionsnummer in der package.json
    exec('ncu -u', (error, stdout, stderr) => {
        if (error) {
            console.error(`Fehler: ${error}`);
            return;
        }
        console.log(`Ausgabe: ${stdout}`);
        console.error(`Fehlerausgabe: ${stderr}`);

        // Befehl zum Installieren der in der package.json eingetragenen Versionen
        exec('npm install', (error, stdout, stderr) => {
            if (error) {
                console.error(`Fehler: ${error}`);
                return;
            }
            console.log(`Ausgabe: ${stdout}`);
            console.error(`Fehlerausgabe: ${stderr}`);
        });
    });
});