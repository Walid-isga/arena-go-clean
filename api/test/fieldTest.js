const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Field = require('../models/field');

// Before all tests, connect to the database
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
});

// After all tests, disconnect from the database
afterAll(async () => {
    await mongoose.disconnect();
});

describe('Field Controller Tests', () => {
    
    test('createField should create a new field', async () => {
        const response = await request(app)
            .post('/api/field') 
            .send({
                name: 'Test Field',
                
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
        
    });

   
    test('updateField should update an existing field', async () => {

        const fieldId = 'existing-field-id';

        const response = await request(app)
            .patch(`/api/field/${fieldId}`)
            .send({
                name: 'Updated Field Name',
                
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Field Name');
        
    });

    

});

