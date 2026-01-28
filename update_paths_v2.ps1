
$dirs = @("pages", "components", "composables", "layouts")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Include *.vue,*.js,*.ts -Recurse
        foreach ($file in $files) {
            $content = Get-Content -Raw $file.FullName
            $newContent = $content
            
            # Replacements
            $newContent = $newContent -replace '/klub', '/clubs'
            $newContent = $newContent -replace '/berita', '/news'
            $newContent = $newContent -replace '/archer/', '/archers/'
            $newContent = $newContent -replace '/archer"', '/archers"'
            $newContent = $newContent -replace "/archer'", "/archers'"
            $newContent = $newContent -replace '/dashboard/archer', '/dashboard/archers'
            $newContent = $newContent -replace '/shop', '/products'
            $newContent = $newContent -replace '/dashboard/shop', '/dashboard/products'
            $newContent = $newContent -replace '/dashboard/product', '/dashboard/products'
            $newContent = $newContent -replace '/api/v1/klub', '/api/v1/clubs'
            
            if ($newContent -ne $content) {
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
                Write-Host "Updated: $($file.FullName)"
            }
        }
    }
}
