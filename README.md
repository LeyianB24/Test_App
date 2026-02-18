# TestApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

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

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project Structure

This is the **Angular Frontend** only. The PHP backend is located at:
```
C:\xampp\htdocs\kra-api\
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
ng serve
```

### 3. Access Application
```
http://localhost:4200
```

## Backend Integration

The Angular app connects to the PHP backend at:
```
http://localhost/kra-api/get_payments.php
```

### Backend Requirements
- XAMPP with Apache & MySQL running
- Database: `kra_itax` with `payments` table
- PHP files in: `C:\xampp\htdocs\kra-api\`

## Key Files

- **`src/app/services/payment.service.ts`** - API integration
- **`src/app/pages/payments.component.ts`** - Payments UI
- **`src/app/models/app.models.ts`** - Data models
- **`src/app/app.config.ts`** - HTTP client configuration

## Features

- Modern UI with glassmorphism effects
- Real-time data from MySQL database
- Responsive design
- Payment management interface
- Search and filtering functionality

## Development

This is a standalone Angular application that communicates with a separate PHP/MySQL backend via HTTP API calls.
