const expect = require('expect');
const request = require('supertest');


const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

//We need to be sure that the database is empty otherway the test fail
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        done();
    });

});

//We start our test case...to run it launch "npm run  test-watch (As in the package.json test description"
describe('POST /todos', ()=>{
    it('Sould create a new TODO entry',(done)=>{
        var text = 'Test TODO text by using supertest';
        request(app)
        .post('/todos')
        //We are sending by POST the text defined above. JSON method is not required by supertest
        .send({text})
        //we expect the status code 200
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res) =>{
            if(err){
               return done(err);
            }
            Todo.find().then((todos)=>{
                //We expect that the text is present in the DB and it comes back. SO we get 1 result
                expect(todos.length).toBe(1);
                //we expect that the same text variable provided is present in the DB
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    //Second test case
    it('Should not create TODO with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        //I pass an empty text
        .send({})
        .expect(400)
        .end((err,res) => {
            if(err){
            return done(err);
            }
            Todo.find().then((todos)=>{
            //We expect 0 as result from the DB
            expect(todos.length).toBe(0);
            done();
            }).catch((e)=>{
                done(e);
        });
    });
});

});
