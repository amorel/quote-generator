const { spawn } = require('child_process');

const runCommand = (command, args = []) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', shell: true });

    process.on('error', (error) => {
      console.error(`Erreur lors de l'exécution de la commande: ${command} ${args.join(' ')}`);
      reject(error);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Commande terminée avec le code de sortie ${code}`);
      }
    });
  });
};

const runDockerCleanupAndRestart = async () => {
  try {
    console.log('Arrêt des conteneurs Docker...');
    await runCommand('docker-compose', ['down', '--volumes', '--remove-orphans']);
    
    console.log('Suppression des images Docker non utilisées...');
    await runCommand('docker', ['image', 'prune', '-af']);
    
    console.log('Suppression des volumes Docker non utilisés...');
    await runCommand('docker', ['volume', 'prune', '-f']);
    
    console.log('Suppression des réseaux Docker non utilisés...');
    await runCommand('docker', ['network', 'prune', '-f']);
    
    console.log('Suppression des conteneurs Docker non utilisés...');
    await runCommand('docker', ['container', 'prune', '-f']);
    
    console.log('Reconstruction et démarrage des conteneurs Docker...');
    await runCommand('docker-compose', ['up', '--build', '-d']);
    
    console.log('Nettoyage et redémarrage des services terminés avec succès.');
  } catch (error) {
    console.error('Une erreur s\'est produite pendant le processus de nettoyage et de redémarrage.');
  }
};

runDockerCleanupAndRestart();
