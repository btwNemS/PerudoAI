<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>PERUDO</title>
    <meta name="description" content="IA contre IA">
</head>

<body>

    <h1>PARTIE DE PERUDO</h1>
    <?php
        require_once("Partie.php");
        //$p=new Partie("Carreau","Pique","Trefle","Coeur");
        //$p=new Partie("Pique","Carreau","Coeur","Trefle");
        //$p=new Partie("Trefle","Coeur","Pique","Carreau");
       //$p=new Partie("Carreau","Pique","Coeur","Trefle");
       //$p=new Partie("Pique","Trefle","Carreau","Coeur");
       //$p=new Partie("Coeur","Carreau","Trefle","Pique");
       
        $p=new Partie("Pique","Coeur","Trefle","Carreau");
        $p->main();
        ?>
</body>

</html>
