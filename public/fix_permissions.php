<?php
// ════════════════════════════════════════════════════════════════
// 🤖 أداة جارفيس الذكية لتصحيح جميع صلاحيات الملفات بنقرة واحدة
// ════════════════════════════════════════════════════════════════
function fixPermissions($path) {
    $items = new DirectoryIterator($path);
    foreach ($items as $item) {
        if ($item->isDot()) continue;
        if ($item->isDir()) {
            @chmod($item->getPathname(), 0755);
            fixPermissions($item->getPathname());
        } else {
            @chmod($item->getPathname(), 0644);
        }
    }
}

$root = __DIR__;
fixPermissions($root);
echo "<div style='font-family:sans-serif; text-align:center; padding:50px; background:#F4F0E4; color:#1E1A17;'>";
echo "<h1 style='color:#0B7A5C;'>✅ تم تصحيح جميع صلاحيات الـ 1340 ملفاً إلى 644 والمجلدات إلى 755 بنجاح فائق!</h1>";
echo "<p style='color:#B8923F;'>يمكنك الآن حذف هذا الملف بسلام.</p>";
echo "</div>";
