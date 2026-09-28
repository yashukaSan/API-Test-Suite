import Ajv from 'ajv';
import * as allPostSchema from '../../src/schemas/jsonplaceholder/all-posts.schema.json';
import * as singlePostSchema from '../../src/schemas/jsonplaceholder/singlepost.schema.json';
import { test, expect } from '@playwright/test';

const ajv = new Ajv();
const validateAll = ajv.compile(allPostSchema);
const validateOne = ajv.compile(singlePostSchema);

test.describe("Validating API responses", ()=>{
    test('API Response Schema for /post', async ({ request }) => {
        const res = await request.get('https://jsonplaceholder.typicode.com/posts');
        expect(res.ok()).toBeTruthy();

        const responseBody = await res.json();
        const isValid = validateAll(responseBody);

        expect(isValid, `Schema error: ${JSON.stringify(validateAll.errors, null, 2)}`).toBe(true);
    });
    test.describe('API Response for IDs', ()=>{
        for(let i=0; i<5; i++){
            test(`API response checking - #${i}`, async({request})=>{
                const res = await request.get(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 100)}`);
                expect(res.status()).toBe(200);

                const resBody = await res.json();
                const isValid = validateOne(resBody);

                expect(isValid).toBe(true);
            });
        } 
    });
})
