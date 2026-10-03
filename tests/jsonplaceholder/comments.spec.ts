import { test, expect } from "@playwright/test";
import * as singleComment from "../../src/schemas/jsonplaceholder/single-comment.schema.json";
import * as allComments from "../../src/schemas/jsonplaceholder/all-comments.schema.json";
import Ajv from "ajv";

const ajv = new Ajv();
const validateAll = ajv.compile(allComments);
const validateOne = ajv.compile(singleComment);

test.describe("Validating API response", ()=>{
    test('Schema check - /comments', async({request})=>{
        const res = await request.get('https://jsonplaceholder.typicode.com/comments');
        expect(res.ok()).toBeTruthy();

        const responseBody = await res.json();
        const isValid = validateAll(responseBody);

        expect(isValid, `Schema error: ${JSON.stringify(validateAll.errors, null, 2)}`).toBe(true);
    });

    test.describe("Schema check on random IDs - /comments/:id", ()=>{
        test.describe('On Valid IDs', ()=>{
            for(let i=0; i<60; i++){
                test(`valid ID #${i+1}`, async({ request }) => {
                    const res = await request.get(`https://jsonplaceholder.typicode.com/comments/${Math.floor(Math.random() * 500)}`);
                    expect(res.status()).toBe(200);
                    const responseBody = await res.json();
                    const isValid= validateOne(responseBody);

                    expect(isValid).toBe(true);
                    expect(isValid, `Schema error: ${JSON.stringify(validateOne.errors, null, 2)}`).toBe(true);
                })
            }
        });
        
        test.describe("On Invalid IDs", ()=>{
            test.describe('Out of Range ID', ()=>{
                for (let i = 1; i <= 50; i++) {
                    test(`ID call #${i}`, async ({ request }) => {
                        const res = await request.get(`https://jsonplaceholder.typicode.com/comments/${Math.floor((Math.random() * 1000) + 500)}`);
                        expect(res.status()).toBe(404);
                    });
                }
            })

            test('test for ID 0', async({ request }) => {
                const res = await request.get(`https://jsonplaceholder.typicode.com/comments/0`);
                expect(res.status()).toBe(404);
            })

            test.describe('alphabet ID Calls', ()=>{
                const alphaID = [
                    'A', 'admin', 'user', 'posts', 'post', 'x', 'xyz', 'abc', 'g56', 'j034',
                    '345h4', '@1', '#34', '34+', 'some', 'all', 'none', 'null', 'undefined', 'false',
                    'true', '1+1', 'yes', 'no', 'get', 'get-all', 'no34w', 'hf4hfj4fj4f', 'h8', '7d7dh',
                    'tom', 'user2', 'user43', '45name', 'post90', 'ummm', 'pqr', 'alpha', 'popular', 'to',
                    'a1c23', 'song', 'indie', 'okay', 'low', 'high', 'fast', 'slow', 'least', 'late',
                    'first', 'second', 'third', 'forth', 'y90y', '34h34', 'sdnsam', 'complete'
                ];
                for(let i=1; i<51; i++){
                    test(`call #${i}`, async ({ request }) => {
                        const res = await request.get(`https://jsonplaceholder.typicode.com/comment/${alphaID[i-1]}`);
                        expect(res.status()).toBe(404);
                    }                        
                    );
                }
            })

            test.describe('Negative IDs', ()=>{
                for(let i=0; i<50;i++){
                    test(`call #${i+1}`, async({ request })=>{
                        const res = await request.get(`https://jsonplaceholder.typicode.com/comments/-${Math.floor(Math.random()*1000)}`);
                        expect(res.status()).toBe(404);
                    })
                }
            })
        })
    })
})