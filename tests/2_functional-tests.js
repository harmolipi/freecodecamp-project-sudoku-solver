const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solving puzzles', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', async () => {
            const res = await chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: puzzles[0][0] });

            assert.equal(res.status, 200);
            assert.equal(res.body.solution, puzzles[0][1]);
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', async () => {
            const res = await chai
                .request(server)
                .post('/api/solve')
                .send({});
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing');
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', async () => {
            const res = await chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: '###..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'});
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', async () => {
            const res = await chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: '123'});
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', async () => {
            const res = await chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'});
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
        });
    });

    suite('Checking placement', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A1',
                    value: '7',
                });
            
            assert.equal(res.status, 200);
            assert.isTrue(res.body.valid);
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '4',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.conflict.length, 1);
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '5',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.conflict.length, 2);
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '2',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.conflict.length, 3);
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field(s) missing');
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '##5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5',
                    coordinate: 'A2',
                    value: '2',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'Z2',
                    value: '2',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid coordinate');
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', async () => {
            const res = await chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '0',
                });
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid value');
        });
    });
});

