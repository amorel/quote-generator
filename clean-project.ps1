Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Green

# Supprimer les node_modules à la racine
if (Test-Path "node_modules") {
    Write-Host "Suppression de node_modules à la racine..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

# Supprimer package-lock.json à la racine
if (Test-Path "package-lock.json") {
    Write-Host "Suppression de package-lock.json à la racine..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
}

# Nettoyer le dossier shared
if (Test-Path "shared/node_modules") {
    Write-Host "Suppression de shared/node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "shared/node_modules"
}
if (Test-Path "shared/package-lock.json") {
    Write-Host "Suppression de shared/package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "shared/package-lock.json"
}

# Nettoyer les dossiers des services
Get-ChildItem -Path "services" -Directory | ForEach-Object {
    $servicePath = $_.FullName
    
    if (Test-Path "$servicePath/node_modules") {
        Write-Host "Suppression de node_modules dans $servicePath..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "$servicePath/node_modules"
    }
    
    if (Test-Path "$servicePath/package-lock.json") {
        Write-Host "Suppression de package-lock.json dans $servicePath..." -ForegroundColor Yellow
        Remove-Item -Force "$servicePath/package-lock.json"
    }
}

Write-Host "✨ Nettoyage terminé!" -ForegroundColor Green
Write-Host "Pour réinstaller les dépendances, exécutez 'npm install'" -ForegroundColor Cyan