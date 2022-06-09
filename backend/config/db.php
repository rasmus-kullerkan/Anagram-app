<?php

// Heroku postgres database

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:
    host=;
    port=5432;
    dbname=',
    'username' => '',
    'password' => '',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    'enableSchemaCache' => true,
    'schemaCacheDuration' => 60,
    'schemaCache' => 'cache',
];
