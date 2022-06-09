# Fronted

### Requirements

Node js.

### Instalation

Run 'npm install' to install required dependecies.

### Config

#### Backend api url

Api url can be edited in .env file in root folder.

### Running locally

1. Run local.bat
2. localhost:3000

### Deploing to Heroku

1. Create Heroku app and add nodejs buildpack.
2. Configure api url in .env
3. Deploy to Heroku
    ```console
    heroku login
    git init
    git checkout -b main
    heroku git:remote -a <app-name>
    git add .
    git commit -m "inital"
    git push heroku main
    ```
4. (opt) Updating
    ```console
    git add .
    git commit -m "update"
    git push heroku main
    ```
