
$dirs = @("pages", "components", "composables", "layouts")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Include *.vue,*.js,*.ts -Recurse
        foreach ($file in $files) {
            $content = Get-Content -Raw $file.FullName
            $newContent = $content
            
            # Fix over-replacements
            $newContent = $newContent -replace 'productsss', 'products'
            $newContent = $newContent -replace 'productss', 'products'
            $newContent = $newContent -replace 'archerss', 'archers'
            $newContent = $newContent -replace 'clubss', 'clubs'
            $newContent = $newContent -replace 'newss', 'news'
            
            if ($newContent -ne $content) {
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
                Write-Host "Fixed: $($file.FullName)"
            }
        }
    }
}
