<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ════════════════════════════════════════════════════════════════
// 🗄️ إعدادات الاتصال بقاعدة بيانات MySQL على سيرفر ICDSoft
// (تستبدل بالبيانات الخاصة بك إذا أنشأت Database في ICDSoft)
// ════════════════════════════════════════════════════════════════
$db_host = 'localhost';
$db_name = 'YOUR_DB_NAME'; // اسم قاعدة البيانات
$db_user = 'YOUR_DB_USER'; // اسم مستخدم قاعدة البيانات
$db_pass = 'YOUR_DB_PASSWORD'; // كلمة مرور قاعدة البيانات

$dataFile = __DIR__ . '/projects_db.json';

// محاولة الاتصال بـ MySQL
$pdo = null;
try {
    if ($db_name !== 'YOUR_DB_NAME' && $db_pass !== 'YOUR_DB_PASSWORD') {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
} catch (Exception $e) {
    $pdo = null;
}

// ════════════════════════════════════════════════════════════════
// 💾 حفظ المشاريع عند استقبال POST
// ════════════════════════════════════════════════════════════════
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if ($input) {
        $projects = json_decode($input, true);
        
        // حفظ في MySQL إذا كانت متصلة
        if ($pdo && is_array($projects)) {
            try {
                $pdo->exec("TRUNCATE TABLE `atg_projects`");
                $stmt = $pdo->prepare("INSERT INTO `atg_projects` (`id`, `category`, `categoryLabel`, `img`, `type`, `title`, `cap`, `loc`, `year`, `status`, `statusLabel`, `desc`, `specs`) VALUES (:id, :category, :categoryLabel, :img, :type, :title, :cap, :loc, :year, :status, :statusLabel, :desc, :specs)");
                foreach ($projects as $p) {
                    $stmt->execute([
                        ':id' => $p['id'] ?? uniqid('proj_'),
                        ':category' => $p['category'] ?? '',
                        ':categoryLabel' => $p['categoryLabel'] ?? '',
                        ':img' => $p['img'] ?? '',
                        ':type' => $p['type'] ?? '',
                        ':title' => $p['title'] ?? '',
                        ':cap' => $p['cap'] ?? '',
                        ':loc' => $p['loc'] ?? '',
                        ':year' => $p['year'] ?? '',
                        ':status' => $p['status'] ?? 'completed',
                        ':statusLabel' => $p['statusLabel'] ?? '',
                        ':desc' => $p['desc'] ?? '',
                        ':specs' => is_array($p['specs'] ?? null) ? json_encode($p['specs'], JSON_UNESCAPED_UNICODE) : ($p['specs'] ?? '[]'),
                    ]);
                }
            } catch (Exception $e) {
                // Fallback to JSON
            }
        }

        // حفظ النسخة الاحتياطية في ملف JSON بالسيرفر
        file_put_contents($dataFile, $input);
        echo json_encode(['status' => 'success', 'message' => 'Projects saved successfully']);
        exit;
    }
}

// ════════════════════════════════════════════════════════════════
// 📖 قراءة المشاريع عند استقبال GET
// ════════════════════════════════════════════════════════════════
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM `atg_projects` ORDER BY `created_at` DESC");
        $rows = $stmt->fetchAll();
        if ($rows && count($rows) > 0) {
            $formatted = [];
            foreach ($rows as $r) {
                $specs = json_decode($r['specs'], true);
                $r['specs'] = is_array($specs) ? $specs : [];
                $formatted[] = $r;
            }
            echo json_encode($formatted, JSON_UNESCAPED_UNICODE);
            exit;
        }
    } catch (Exception $e) {
        // Fallback to JSON
    }
}

if (file_exists($dataFile)) {
    echo file_get_contents($dataFile);
} else {
    echo json_encode([]);
}
