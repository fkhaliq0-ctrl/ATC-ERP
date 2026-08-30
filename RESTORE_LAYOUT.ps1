# ============================================
# RESTORE MASTER BACKUP
# ============================================

$backupFolder = "E:\ATC-ERP\MASTER_BACKUP_2026-08-25_XX-XX-XX"  # REPLACE WITH ACTUAL FOLDER NAME
$srcFolder = "E:\ATC-ERP\frontend\src"

Write-Host "⚠️ WARNING: This will RESTORE all files from backup!" -ForegroundColor Red
Write-Host "   This will OVERWRITE your current files." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type 'YES' to confirm restore"

if ($confirm -eq "YES") {
    Copy-Item "$backupFolder\*" $srcFolder -Recurse -Force
    Write-Host ""
    Write-Host "✅ RESTORE COMPLETE!" -ForegroundColor Green
    Write-Host "📌 REFRESH BROWSER (Ctrl+F5) NOW!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Restore cancelled." -ForegroundColor Red
}
