import { expect, test } from '@playwright/test';
import * as singleAlbum from '../../src/schemas/jsonplaceholder/single-album.schema.json';
import * as allAlbum from '../../src/schemas/jsonplaceholder/all-albums.schema.json';
import * as albumPhoto from '../../src/schemas/jsonplaceholder/single-album-photos.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validateAll = ajv.compile(allAlbum);
const validateOne = ajv.compile(singleAlbum);
const validatePhoto = ajv.compile(albumPhoto);

test.describe('validating API responses', ()=>{

    test('Schema check ', async({ request })=>{
        const res = await request.get('https://jsonplaceholder.typicode.com/albums');
        expect(res.status).toBeTruthy();

        const resBody = await res.json();
        const isValid = validateAll(resBody);
        expect(isValid, `Schema Error: ${JSON.stringify(validateAll, null, 2)}`).toBe(true);
    });

    test.describe('Valid IDs Check', ()=>{
        for(let i=1; i<=25; i++){
            test(`test #${i}`, async({ request })=>{
                const res = await request.get(`https://jsonplaceholder.typicode.com/albums/${Math.floor(Math.random()*99 +1)}`);
                expect(res.status()).toBe(200);

                const resBody = await res.json();
                const isValid = validateOne(resBody);
                expect(isValid).toBe(true);
            });
        }  
    });

    test.describe('InValid IDs check', ()=>{
        test.describe(`With Out of Range IDs`, () => {
            for (let i = 1; i < 26; i++) {
                test(`test #${i}`, async ({ request }) => {
                    const res = await request.get(`https://jsonplaceholder.typicode.com/albums/${Math.floor(Math.random() * 1000 + 100)}`)
                    expect(res.status()).toBe(404);
                });
            }
        });

        test(`With 0`, async({request})=>{
            const res = await request.get('https://jsonplaceholder.typicode.com/albuma/0');
            expect(res.status()).toBe(404);
        })

        test.describe(`Random Strings`, ()=>{
            const randomStr = [
                'one', 'first', 'last', 'open', 'accept', 'neglect', 'null', 'none', 'abc', 'admin',
                'xyz', 't4t5t4', 'a123', 'x89', '1a', 'user', 'player', 'people', 'person', 'indie',
                'tom', 'bob', 'request', 'all', 'every', 'secret', 'undefined', 'false', 'true', 'joy',
                "1+1", '0+1', 'if', 'else', 'post90', 'photo', 'get', 'put', 'patch', 'pqr', 'pic1',
                'pick1', 'showall', 'shownone', 'show','A', 'B', 'C', 'high', 'low'
            ]
            for(let i=1; i<51; i++){
                test(`test #${i}`, async({request})=>{
                    const res = await request.get(`https://jsonplaceholder.typicode.com/albums/${randomStr[i]}`);
                    expect(res.status()).toBe(404);
                })
            }
        });

        test.describe(`Negative IDs`, ()=>{
            for (let i = 1; i < 26; i++) {
                test(`test #${i}`, async({request})=>{
                    const res = await request.get(`https://jsonplaceholder.typicode.com/albums/-${Math.floor(Math.random()*100)}`)
                    expect(res.status()).toBe(404);
                })
            }
        })
    });

    test.describe(`checking /album/:id/photos`, ()=>{
        test.describe('Valid IDs Check', () => {
            for (let i = 1; i <= 25; i++) {
                test(`test #${i}`, async ({ request }) => {
                    const res = await request.get(`https://jsonplaceholder.typicode.com/albums/${Math.floor(Math.random() * 99 + 1)}/photos`);
                    expect(res.status()).toBe(200);

                    const resBody = await res.json();
                    const isValid = validatePhoto(resBody);
                    expect(isValid).toBe(true);
                });
            }
        });
    })
})