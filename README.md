# API Test Suite
---
## Used Stack
- **Playwright**
- **TypeScript**
- **ajv**
---
## Test Commands
-  **npx playwright test**
-  **npx playwright test --ui**
-  **npx playwright test --debug**
-  **npx playwright codegen**
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
|   |   |   |----all-albums.schema.json
|   |   |   |----all-comments.schema.json
|   |   |   |----all-photos.schema.json
|   |   |   |----all-posts.schema.json
|   |   |   |----all-todos.schema.json
|   |   |   |----all-users.schema.json
|   |   |   |----single-album-photos.schema.json
|   |   |   |----single-album.schema.json
|   |   |   |----single-comment.schema.json
|   |   |   |----single-photo-album.schema.json
|   |   |   |----single-photo.schema.json
|   |   |   |----single-post.schema.json
|   |   |   |----single-todo.schema.json
|   |   |   |----single-user.schema.json
|   |   |----regres
|   |----index.ts
|----tests
|   |----api-creation-test
|   |   |----jsonplaceholder
|   |   |----regres
|   |----api-delete-test
|   |   |----jsonplaceholder
|   |   |----regres
|   |----api-update-test
|   |   |----jsonplaceholder
|   |   |----regres
|   |----schema-test
|   |   |----jsonplaceholder
|   |   |   |----albums.spec.ts
|   |   |   |----comments.spec.ts
|   |   |   |----page.spec.ts
|   |   |   |----photos.spec.ts
|   |   |   |----posts.spec.ts
|   |   |   |----todos.spec.ts
|   |   |   |----users.spec.ts
|   |   |----regres
|----.gitignore
|----package-lock.json
|----package.json
|----playwright.comfig.ts
|----README.md
|----tsconfig.json
|----tslint.json
```