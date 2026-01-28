
$files = Get-ChildItem -Path . -Include *.vue,*.js,*.ts -Recurse -Exclude node_modules,.nuxt,.output

foreach ($file in $files) {
    if ($file.Attributes -band [io.fileattributes]::Directory) { continue }
    
    $content = Get-Content -Raw $file.FullName
    $newContent = $content
    
    # Replace /klub with /clubs
    $newContent = $newContent -replace '/klub', '/clubs'
    
    # Replace /berita with /news
    $newContent = $newContent -replace '/berita', '/news'
    
    # Replace /archer (singular) with /archers (plural)
    # Be careful not to replace /archers with /archerss
    # Use word boundary or lookahead if possible, or just be specific
    # In Nuxt, it usually looks like `/archer/` or `/archer"` or `/archer'`
    $newContent = $newContent -replace '/archer/', '/archers/'
    $newContent = $newContent -replace '/archer"', '/archers"'
    $newContent = $newContent -replace "/archer'", "/archers'"
    # Specific dashboard path
    $newContent = $newContent -replace '/dashboard/archer', '/dashboard/archers'
    
    # Replace /shop with /products
    $newContent = $newContent -replace '/shop', '/products'
    # Specific dashboard path
    $newContent = $newContent -replace '/dashboard/shop', '/dashboard/products'
    $newContent = $newContent -replace '/dashboard/product', '/dashboard/products'
    # Be careful with /product/ slugs if any
    
    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}
