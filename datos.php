<?php
$a = $_POST["nombre"] ?? "";
$b = $_POST["direccion"] ?? "";
$c = $_POST["telefono"] ?? "";
$d = $_POST["pago"] ?? "";
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gracias por tu compra</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body class="thankyou-body">
    <main class="thankyou-card">
      <p class="eyebrow">Pedido confirmado</p>
      <h1>¡Gracias por tu compra!</h1>

      <div class="customer-data">
        <p><strong>Nombre:</strong> <?php echo htmlspecialchars($a); ?></p>
        <p><strong>Dirección:</strong> <?php echo htmlspecialchars($b); ?></p>
        <p><strong>Teléfono:</strong> <?php echo htmlspecialchars($c); ?></p>
        <p><strong>Método de pago:</strong> <?php echo htmlspecialchars($d); ?></p>
      </div>
    </main>
  </body>
</html>