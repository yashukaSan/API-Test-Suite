import { expect, test } from '@playwright/test';
import * as singleAlbum from '../../src/schemas/jsonplaceholder/single-album.schema.json';
import * as allAlbum from '../../src/schemas/jsonplaceholder/all-albums.schema.json';
import * as albumPhoto from '../../src/schemas/jsonplaceholder/single-album-photos.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validateAll = ajv.compile(allAlbum);
const validateOne = ajv.compile(singleAlbum);
const validatePhoto = ajv.compile(albumPhoto);

test.use({baseURL: 'https://jsonplaceholder.typicode.com/'});
test.describe(`JSONPlaceholder /albums API`, ()=>{
    test(`should return all albums with valid schema `, async ({request})=>{
        const res = await request.get('/albums');
        expect(res.ok()).toBeTruthy();

        const resBody = await res.json();        
        const isValid = validateAll(resBody);
        expect(isValid, `Schema error: ${validateAll.errors, null, 2}`).toBe(true);
    });

    test('should 200 for valid IDs',async ({request})=>{
        const validIDs = [1, 2, 50, 60, 99, 100];
        for (const id of validIDs) {
            await test.step(`Checking Valid ID: ${id}`, async () => {
                const res = await request.get(`/albums/${id}`);
                expect(res.status()).toBe(200);

                const resBody = await res.json();
                const isValid = validateOne(resBody);
                expect(isValid, `Schema error: ${validateOne.errors, null, 2}`).toBe(true);
})
        }
    })
    test.describe(`Invalid IDs handling (404s)`, ()=>{
        test(`Checking invalid Numeric IDs: negative, out-of-range`, async({request})=>{
            const invalidIDs = [0, -1, 101, -10, 200, -200];
             for(const id of invalidIDs){
                await test.step(`Chekcing Invalid ID: ${id}`, async()=>{
                    const res = await request.get(`/albums/${id}`);
                    expect(res.status()).toBe(404);
                });
             }
        });

        test(`Checking Invalid AlphaNumeric IDs`, async({request})=>{
            const invalidIDs = ['A', 'admin', 'user', 'photo', 'null', 'first', 'true', 'false'];
            for(const id of invalidIDs){
                await test.step(`Checking ID: ${id}`, async()=>{
                    const res = await request.get(`/albums/id`);
                    expect(res.status()).toBe(404);
                })
            }
        })
    });
});

