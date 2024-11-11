const fs = require('fs').promises;
const path = require('path');

async function deleteReports(dir) {
    try {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);

            // Vérifier si c'est un dossier à ignorer (comme node_modules)
            if (file === 'node_modules' || file.startsWith('.')) {
                continue;
            }

            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                // Appel récursif pour les sous-dossiers
                await deleteReports(filePath);
            } else if (file.startsWith('report')) {
                // Supprimer uniquement les fichiers commençant par "report"
                await fs.unlink(filePath);
                console.log(`Fichier supprimé: ${filePath}`);
            }
        }
    } catch (err) {
        console.error(`Erreur lors de la manipulation de ${dir}:`, err);
    }
}

// Dossiers de départ à vérifier
const directories = [
    path.join(__dirname, '..', 'services'),
    path.join(__dirname, '..', 'shared'),
    path.join(__dirname, '..', 'services', 'user-service')
];

directories.forEach((dir) => deleteReports(dir));
