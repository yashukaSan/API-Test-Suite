# API Test Suite
---
## Used Stack
- **Playwright**
- **TypeScript**
- **ajv**
---
## Test Commands
- ### npx playwright test
- ### npx playwright test --ui
- ### npx playwright test --debug
- ### npx playwright codegen
---

## APIs To Cover
- **https://jsonplaceholder.typicode.com**
- **https://regres.in/**
- **https://httpbin.org/**
- **https://fakestoreapi.com/**
- **https://gorest.co.in/**
---

## Cuurent Project Structure

```text
API-Test-Suite/
|----src/
|   |----schemas/
|   |   |----jsonplaceholder
|   |   |   |----all-posts.schema.json
|   |   |   |----singlepost.schema.json
|   |   |----regres
|   |----index.ts
|----tests
|   |----jsonplaceholder
|   |   |----page.spec.ts
|   |   |----schema.spec.ts
|   |----regres
|----.gitignore
|----package-lock.json
|----package.json
|----playwright.comfig.ts
|----README.md
|----tsconfig.json
|----tslint.json
```