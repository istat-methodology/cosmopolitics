$Version = ((Get-Content .\prepare-node.sh | ?{ $_ -match '^# Version [0-9\.]+$' }) -split ' ')[2]
Compress-Archive -Update -Path .\prepare-node.sh -DestinationPath .\prepare-node_$Version.zip

$Version = ((Get-Content .\cosmoDataUpdate.py | ?{ $_ -match '^# Version [0-9\.]+$' }) -split ' ')[2]
Compress-Archive -Update -Path .\cosmoDataUpdate.py,  .\cosmoUtility.py, \run.sh, .\requirements.txt -DestinationPath .\cosmoDataUpdate_$Version.zip

Write-Host "Operation completed."
