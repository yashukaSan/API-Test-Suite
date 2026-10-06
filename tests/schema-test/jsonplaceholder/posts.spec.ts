import Ajv from 'ajv';
import * as allPostSchema from '../../src/schemas/jsonplaceholder/all-posts.schema.json';
import * as singlePostSchema from '../../src/schemas/jsonplaceholder/single-post.schema.json';
import { test, expect } from '@playwright/test';

const ajv = new Ajv();
const validateAll = ajv.compile(allPostSchema);
const validateOne = ajv.compile(singlePostSchema);

test.use({baseURL: 'https://jsonplaceholder.typicode.com'});
test.describe("JSOINPlaceHolder /posts API", ()=>{
    test('API Schema test', async ({ request }) => {
        const res = await request.get('/posts');
        expect(res.ok()).toBeTruthy();

        const responseBody = await res.json();
        const isValid = validateAll(responseBody);

        expect(isValid, `Schema error: ${JSON.stringify(validateAll.errors, null, 2)}`).toBe(true);
    });
    test.describe('Schema check for Valid IDs', ()=>{
        //valid id test
    });

    //test for invalid IDs
    test.describe("test of Invalid IDs", ()=> {
        test(`Checking Invalid Numric IDs: Negatiuve, zero, out-of-range`, async({request})=>{
            const invalidID = [0, -1, -100, 101, -67, 190, 1000];
            for(const id of invalidID){
                await test.step(`Checking ID: ${id}`, async()=>{
                    const res = await request.get(`/posts/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });

        test('Checking Non-Numeric IDs', async({request})=>{
            const invalidIDs = ['a', 'user', 'one', 'admin', 'a2', 'new'];

            for(const id of invalidIDs){
                await test.step(`Checking ID: ${id}`, async () => {
                    const res = await request.get(`/posts/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        })
    });
})
