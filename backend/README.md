# Backend

### Requirements

PHP and Composer

### Instalation

Run 'composer update && composer install' to install required dependecies.
Run 'php requirements.php' to see which php extensions are required.

### Config

#### Mode

To switch between 'dev' and 'production mode' configure 'index.php' file in 'web' folder.

#### Database

Databases can be configured in the 'config' folder with 'db.php', 'db_test.php' and 'db_dev.php'.

#### Migrations

1. Modify 'yii' file
2. Run 'yii migrate'

### Tests

Tests can be run with 'run_tests.bat'.

### Running locally

1. Run local.bat
2. localhost:8080

### Deploing to Heroku

1. Create Heroku app and add php buildpack. (opt) Add postgresdb
2. Configure db in /config/db.php
3. Modify index.php
4. Deploy to Heroku
    ```console
    heroku login
    git init
    git checkout -b main
    heroku git:remote -a <app-name>
    git add .
    git commit -m "inital"
    git push heroku main
    ```
5. Migrate by modifing 'yii' file and running 'yii migrate'
6. (opt) Updating
    ```console
    git add .
    git commit -m "update"
    git push heroku main
    ```
