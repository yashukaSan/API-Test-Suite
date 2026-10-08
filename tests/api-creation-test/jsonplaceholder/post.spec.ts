import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://jsonplaceholder.typicode.com'});

test.describe(`POST Request - Creat a post`, ()=>{
    test(`POST 1`, async({request})=>{
        const res = await request.post(`/posts`, {
            data:{
                userId: 1001,
                id: 101,
                title: 'First external Post',
                body: 'Push to the posts via post method. '
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });
        expect(res.status()).toBe(201);
        const body = await res.json();
        expect(body).toMatchObject({
            userId: 1001,
            id: 101,
            title: 'First external Post',
            body: 'Push to the posts via post method. '
        });
    });
})