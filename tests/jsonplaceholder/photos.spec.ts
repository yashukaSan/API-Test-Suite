import { test, expect } from "@playwright/test";
import * as singlePhoto from "../../src/schemas/jsonplaceholder/single-photo.schema.json";
import * as allPhotos from "../../src/schemas/jsonplaceholder/all-photos.schema.json";
import Ajv from "ajv";

const ajv = new Ajv();
const validateAll = ajv.compile(allPhotos);
const validateOne = ajv.compile(singlePhoto);

// Tip: Set "baseURL: 'https://jsonplaceholder.typicode.com'" in your playwright.config.ts
test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

test.describe("JSONPlaceholder - /photos API", () => {

    test('should return all photos with valid schema', async ({ request }) => {
        const res = await request.get('/photos');

        expect(res.ok()).toBeTruthy();
        const responseBody = await res.json();

        const isValid = validateAll(responseBody);
        expect(isValid, `Schema error: ${JSON.stringify(validateAll.errors, null, 2)}`).toBe(true);
    });

    test('should validate schema on specific valid IDs', async ({ request }) => {
        // Test boundary conditions and sample IDs deterministically instead of 60 random loops
        const validIds = ['1', '100', '5000', '505'];

        for (const id of validIds) {
            await test.step(`Checking valid ID: ${id}`, async () => {
                const res = await request.get(`/photos/${id}`);
                expect(res.status()).toBe(200);

                const responseBody = await res.json();
                const isValid = validateOne(responseBody);
                expect(isValid, `Schema error for ID ${id}: ${JSON.stringify(validateOne.errors, null, 2)}`).toBe(true);
            });
        }
    });

    test.describe("Invalid ID Handling (404s)", () => {

        test('should return 404 for out-of-range, negative, and zero IDs', async ({ request }) => {
            const boundaryInvalidIds = [0, -1, -500, -501, 9999];

            for (const id of boundaryInvalidIds) {
                await test.step(`Checking invalid numeric ID: ${id}`, async () => {
                    const res = await request.get(`/photos/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });

        test('should return 404 for non-numeric/alphabetic IDs', async ({ request }) => {
            // Shortened targeted list representing diverse data types (strings, boolean strings, malicious inputs)
            const alphaIds = ['A', 'admin', 'null', 'undefined', 'false', '1+1', '@1', 'hf4hfj4fj4f'];

            for (const id of alphaIds) {
                await test.step(`Checking alphanumeric ID: ${id}`, async () => {
                    const res = await request.get(`/photos/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });

    });
});
