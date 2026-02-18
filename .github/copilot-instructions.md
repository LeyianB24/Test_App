# Angular iTax Portal - AI Agent Guidelines

## Architecture Overview
**Standalone Components Architecture** - This is an Angular 21+ standalone app (no `NgModule`). All components declare their own dependencies via `imports` array. No shared module exists.

- **Root**: `App` component (`src/app/app.ts`) - iTax portal dashboard
- **Key Domain**: Notification system (`src/app/notification/`) - service + component
- **Entry Point**: `src/main.ts` bootstraps with `appConfig` (routing + error listeners)

## Project Setup & Commands
```bash
npm start          # ng serve (dev server, port 4200)
npm run build      # Production build to dist/
npm run watch      # Watch mode build
npm test           # Vitest unit tests
ng generate component <name>  # Create standalone component
```

**Build Constraints** (in `angular.json`):
- Production: max 500KB initial bundle, 1MB error
- Component styles: max 4KB warning, 8KB error
- All CSS compiled inline, assets from `public/` folder

## Code Patterns & Conventions

### 1. Component Structure
**Always use standalone components** with explicit `imports`:
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterOutlet],  // Declare all dependencies
  templateUrl: './example.html',
  styleUrls: ['./example.css']
})
```

### 2. Services & Dependency Injection
**Notification Service pattern** (`notification.service.ts`):
- `@Injectable({ providedIn: 'root' })` for singleton services
- Use `BehaviorSubject` for reactive state management
- Services auto-cleanup via unsubscription (see `App` component)

Example:
```typescript
notifications$ = new BehaviorSubject<Notification[]>([]);
show(message: string, type: 'success' | 'error' | 'info')  // Auto-dismiss 3s
```

### 3. Component Lifecycle
- **App component** implements `OnInit, OnDestroy` for side effects (timers, subscriptions)
- Always unsubscribe from observables in `ngOnDestroy` to prevent memory leaks
- Use `| async` pipe in templates to auto-unsubscribe

### 4. Data Types & Interfaces
Define domain types upfront (see `app.ts`):
```typescript
interface TaxStat {
  label: string;
  value: number;      // Use for formatting (CurrencyPipe, DecimalPipe)
  trend: string;
  color: 'red' | 'green' | 'blue' | 'orange';
  progress: number;
}
```
Use `Date` objects, not strings, for dates—enables Angular pipes (`DatePipe`, `DatetimePipe`).

### 5. Template Patterns
- Use `*ngFor`, `*ngIf` from `CommonModule` for conditionals/loops
- Use `[ngClass]` with object for dynamic styling
- Bind events: `(click)="method()"`, `(submit)="form.submit()"`
- Format values: `{{ value | currency:'KES' }}`, `{{ date | date:'short' }}`

### 6. Routing
- Routes defined in `app.routes.ts` (currently empty, ready for expansion)
- Lazy loading via `loadComponent:` for feature modules
- Always use typed routing with `inject(Router)` + `navigateByUrl()`

## TypeScript Strictness
**Strict mode enabled** (`tsconfig.json`):
- `noImplicitAny: true` - no implicit `any` types
- `strictTemplates: true` - type-checked templates
- `noImplicitOverride: true` - override keyword required
- Always provide explicit return types on functions

## Testing
- **Framework**: Vitest (ES modules, jsdom)
- **Test files**: `*.spec.ts` colocated with source
- Example test file: `app.spec.ts` - use `describe()`, `it()`, `expect()`
- Run tests: `npm test` or `ng test`

## Styling
- **CSS only** (no SCSS/LESS), styles in `*.component.css` files
- Global styles in `src/styles.css`
- **Prettier formatting** (printWidth: 100, singleQuote: true)
- Angular parser for HTML files

## Common Workflows for AI Agents

### Adding a New Feature
1. Create component: `ng generate component feature-name`
2. Define interfaces for data in component file
3. Import in parent and add to imports array
4. Inject services via constructor if needed
5. Write tests in `*.spec.ts`

### Adding a Service
1. Create file: `src/app/feature/feature.service.ts`
2. Decorate: `@Injectable({ providedIn: 'root' })`
3. Use `BehaviorSubject` for state, methods for actions
4. Import in component constructor
5. Subscribe in templates via `| async` pipe

### Debugging
- Dev server: `npm start` (HMR enabled, source maps on)
- Browser DevTools: Angular DevTools extension recommended
- Check console for strict template errors
- Use `ng serve --open` to auto-open browser

## Key Files Reference
- `src/app/app.ts` - Root component, data models (TaxStat, Activity)
- `src/app/notification/` - Reusable service + component pattern to follow
- `src/app/app.routes.ts` - Routing configuration (ready for expansion)
- `angular.json` - Build config, bundle budgets
- `package.json` - Dependencies (Angular 21, Vitest, RxJS)
