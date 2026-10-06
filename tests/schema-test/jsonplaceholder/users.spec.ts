import { test, expect } from '@playwright/test';
import * as allUsers from '../../src/schemas/jsonplaceholder/all-users.schema.json';
import * as singleUser from '../../src/schemas/jsonplaceholder/single-user.schema.json';
import Ajv from 'ajv'

const ajv = new Ajv();
const validateAll = ajv.compile(allUsers);
const validateOne = ajv.compile(singleUser);

test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

test.describe(`JSONPlaceHolder /users API`, () => {
    test('Checking all users schema', async ({ request }) => {
        const res = await request.get('/users');
        expect(res.ok()).toBeTruthy();

        const resBody = await res.json();
        const isValid = validateAll(resBody);

        expect(isValid, `Schema errors: ${validateAll.errors, null, 2}`).toBe(true);
    });

    test(`Checking the particaular Schema`, async ({ request }) => {
        const validID = [1, 10, 3, 6];

        for (const id of validID) {
            await test.step(`Checking Valid ID: ${id}`, async () => {
                const res = await request.get(`/users/${id}`);
                expect(res.ok()).toBeTruthy();

                const resBody = await res.json();
                const isValid = validateOne(resBody);

                expect(isValid, `Schema Error: ${validateOne.errors, null, 2}`).toBe(true);
            });
        }
    });

    test.describe(`Handling Invalid ID (404s)`, () => {

        test(`Checking Invalid Numeric Values: negative, zero, out-of-range`, async({request})=>{
            const inValidID = [-12, -1, -10, 11, 0, 13, 13, -1];

            for(const id of inValidID){
                await test.step(`Checking ID: ${id}`, async ()=>{
                    const res = await request.get('/users/id');
                    expect(res.status()).toBe(404);
                });
            }
        });

        test(`Checking no numric IDs`, async({request})=>{
            const invalidID = ['new', 'admin', 'true', 'false', 'one', 'user', 'h3h', 'abc', '1a', 'last' ];

            for(const id of invalidID){
                await test.step(`Checking ID: ${id}`, async()=>{
                    const res = await request.get(`/users/${id}`);
                    expect(res.status()).toBe(404);
                });
            }
        });
})
})