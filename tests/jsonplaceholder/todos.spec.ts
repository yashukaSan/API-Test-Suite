import { test, expect } from '@playwright/test';
import * as allTodos from '../../src/schemas/jsonplaceholder/all-todos.schema.json'
import * as singleTodo from '../../src/schemas/jsonplaceholder/single-todo.schema.json'
import Ajv from 'ajv';

const ajv = new Ajv();
const validateAll = ajv.compile(allTodos);
const validateOne = ajv.compile(singleTodo);

test.use({ baseURL: 'https://jsonplaceholder.typicode.com'});

test.describe("JSONPlaceholder - /todos API", ()=>{
    test('should return all todos with valid schema', async({request})=>{
        const res = await request.get('/todos');

        expect(res.ok()).toBeTruthy();
        const resBody = await res.json();
        const isValid = validateAll(resBody);
        expect(isValid, `Schema error: ${JSON.stringify(validateAll.errors, null, 2)}`).toBe(true);
    });

    test('should return 200 for valid IDs', async ({request})=>{
        const someValidIds = [40, 1, 200, 100];
        for(const id of someValidIds){
            await test.step(`valid ID: ${id}`, async()=>{
                const res = await request.get(`/todos/${id}`);
                expect(res.ok()).toBeTruthy();
                const resBody = await res.json();
                const isValid = validateOne(resBody);
                expect(isValid, `Schema error: ${JSON.stringify(validateOne.errors, null, 2)}`).toBe(true);
            })
        }
    })

    test.describe('Invalid ID Handling (404s)', ()=>{
        test('should return 404 for out-of-range, negative, and zero IDs', async ({ request })=>{
            const boundaryInvalidIDs = [0, -1, 201, -200, 450];

            for(const id of boundaryInvalidIDs){
                await test.step(`Checking invalid numeric ID: ${id}`, async()=>{
                    const res = await request.get(`/todos/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });

        test('should return 404 for non-numeric/alphabets IDs', async({ request })=>{
            const alphaIDs = ['A', 'one', 'admin', 'null', 'true', 'false', '1+1', 'h3u3i2', 'start', 'user'];

            for(const id of alphaIDs){
                await test.step(`Checking alphanumeric ID: ${id}`, async()=>{
                    const res = await request.get(`/todos/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });
    });
});