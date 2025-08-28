# AngularFormsTutoriall

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building
Step1: npm run deploy:gh
Step2: update in index.html <base href="./">
Step3: npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App

## Command Already added in package.json
ng build --configuration production --base-href /Flight-Luggage-Tracker-App/
cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/
npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App

## Run Server
ng serve --host 0.0.0.0 --port 4200

