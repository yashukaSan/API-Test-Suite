import Ajv from 'ajv';
import * as allPostSchema from '../../src/schemas/jsonplaceholder/all-posts.schema.json';
import * as singlePostSchema from '../../src/schemas/jsonplaceholder/single-post.schema.json';
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
    test.describe('API Response for Valid IDs', ()=>{
        for(let i=0; i<5; i++){
            test(`Valid ID #${i}`, async({request})=>{
                const res = await request.get(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 100)}`);
                expect(res.status()).toBe(200);

                const resBody = await res.json();
                const isValid = validateOne(resBody);

                expect(isValid).toBe(true);
            });
        } 
    });
    //test cases for the non numberic IDs
    test.describe("API response for Invalid IDs", ()=> {
        const invalid_id = ["abc", "q1", "12b", "3", "xyz"];
        for(let i=0; i<5; i++ ){
            test(`Invalid ID #${i+1} `, async({ request })=> {
                const res= await request.get(`https://jsonplaceholder.typicode.com/posts/${invalid_id[i]}`);
                if(i==3) expect(res.status()).toBe(200);
                else expect(res.status()).toBe(404);
            })
        }
    });

    //test for the non-negative IDs
    test.describe("API for the negative IDs ", ()=>{
        for(let i=0; i<5; i++){
            test(`Negative ID #${i}`, async({request})=>{
                const res= await request.get(`https://jsonplaceholder.typicode.com/posts/-${Math.floor(Math.random() * 100)}`);
                expect(res.status()).toBe(404);
            })
        }
    });

    test('API call on ID 0', async({request})=>{
        const res = await request.get('https://jsonplaceholder.typicode.com/posts/0');
        expect(res.status()).toBe(404);
    });

    test.describe('API call on out-of-bound IDs', ()=>{
        
        for(let i=0; i<10; i++){
            test(`Out-of-Bound #${i+1}`, async({request})=>{
                const res = await request.get(`https://jsonplaceholder.typicode.com/posts/${Math.floor((Math.random()*100)+100 )}`);
                expect(res.status()).toBe(404);
            })
        }
    })
})
