# Flight Luggage Tracker App

This project is an Angular application built for tracking and editing luggage records. It uses Angular 20 with Angular Material and stores its data through a REST API hosted on MockAPI.

## Project stack
- Angular 20
- TypeScript
- Angular Material
- MockAPI.io for remote data storage

## Stable branch
```bash
git checkout flight-image-update
```

## Push code to GitHub
```bash
git add .
git commit -m "Update luggage app"
git push -u origin flight-image-update
```

## 1) Install dependencies
From the project root, run:

```bash
npm install
```

## 2) Run the app locally
Start the Angular development server:

```bash
npm start
```

Or run directly with host/port settings:

```bash
ng serve --host 0.0.0.0 --port 4200
```

Then open:

```text
http://localhost:4200/
```

The app automatically reloads when changes are made in the source files.

## 3) Data storage and API details
The application stores and updates luggage data through a remote MockAPI service.

Base API URL:

```text
https://68b65070e5dc090291b15920.mockapi.io/luggage
```

The service uses Angular HttpClient to interact with the API:

- `getById(id)` → GET request to fetch one luggage record
- `updateRecord(id, data)` → PUT request to update one luggage record

Example request logic used in the app:

```ts
private readonly baseUrl = 'https://68b65070e5dc090291b15920.mockapi.io/luggage';

getById(id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}

updateRecord(id: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/${id}`;
  return this.http.put(url, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

This means the app is not storing data in localStorage or a database in the browser. It persists the information in the MockAPI collection for the luggage records.

## 4) Build the app
For a normal Angular build:

```bash
npm run build
```

For production build with GitHub Pages path configuration:

```bash
ng build --configuration production --base-href /Flight-Luggage-Tracker-App/
```

If you need the browser folder copied explicitly:

```bash
cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/
```

## 5) Deploy to GitHub Pages
Use the following commands in order:

```bash
npm run deploy:gh
```

The script added in `package.json` does this:

```bash
ng build --configuration production --base-href /Flight-Luggage-Tracker-App/
cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/
```

Then publish the build folder with Angular CLI GitHub Pages:

```bash
npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App
```

### Important deployment note
Before deploying to GitHub Pages, set the base path in the app HTML to relative routing:

```html
<base href="./">
```

This is important because GitHub Pages deploys the site under a subpath and the app should resolve assets correctly.

## 6) Full deployment checklist
1. Install dependencies
   ```bash
   npm install
   ```
2. Run locally
   ```bash
   ng serve --host 0.0.0.0 --port 4200
   ```
3. Confirm API connectivity to MockAPI
4. Build production app
   ```bash
   ng build --configuration production --base-href /Flight-Luggage-Tracker-App/
   ```
5. Copy the browser build output if needed
   ```bash
   cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/
   ```
6. Deploy to GitHub Pages
   ```bash
   npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App
   ```

## 7) Useful command summary
```bash
npm install
npm start
ng serve --host 0.0.0.0 --port 4200
npm run build
ng build --configuration production --base-href /Flight-Luggage-Tracker-App/
cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/
npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App
```

## 8) Code scaffolding
Angular CLI includes code generation helpers:

```bash
ng generate component component-name
ng generate --help
```

This project was generated using Angular CLI version 20.0.4.

## Pre branch stable
angular-updated-version


<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SkyBagz ☁️ 🧳</title>
  <base href="./">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="./favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="mat-typography">
  <app-root></app-root>
</body>
</html>