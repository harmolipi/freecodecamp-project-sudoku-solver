const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solving puzzles', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: puzzles[0][0] })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzles[0][1]);
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '###..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: '123' })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.body.error,
                        'Expected puzzle to be 81 characters long'
                    );
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({
                    puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('Checking placement', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A1',
                    value: '7',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '4',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.conflict.length, 1);
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '5',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.conflict.length, 2);
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '2',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.conflict.length, 3);
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '##5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: '2',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5',
                    coordinate: 'A2',
                    value: '2',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.body.error,
                        'Expected puzzle to be 81 characters long'
                    );
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'Z2',
                    value: '2',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: puzzles[0][0],
                    coordinate: 'A2',
                    value: '0',
                })
                .end((_err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });
});