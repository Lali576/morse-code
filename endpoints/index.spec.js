'use strict';

const {expect} = require('chai');
const app = require("./index.js");
const request = require('supertest');

describe ('Morse-coding', function() {
    describe('POST new user', function() {        
        it('should return the token of the new regristrated user', function(done) {
            app.init();
            request(app)
                .post('/users')
                .send("username=Sender&name=FullName")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) throw err;
                    expect(res.body).to.eql({token: 'Sendertoken'});
                    done();
                });
        });

        it('should return the token of the another new regristrated user', function(done) {
            request(app)
                .post('/users')
                .send("username=Receiver&name=FullName")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) throw err;
                    expect(res.body).to.eql({token: 'Receivertoken'});
                    done();
                });
        });
    });

    describe('POST new message', function() {
        it('should respond 200 for sending a message', function(done) {
            request(app)
                .post('/users/Receiver/messages')
                .send("message=...---...&to=Receiver&from=Sender")
                .expect(200)
                .end(function(err, res) {
                    if(err) throw err;
                    done();
                });
        });
    });

    
    describe('GET transcripted message', function() {
        it('should translate the sent Morse-Code message', function(done) {
            request(app)
                .get('/users/Receiver/messages')
                .expect('Content-Type', 'text/plain; charset=utf-8')
                .expect(200)
                .end(function(err, res) {
                    if(err) throw err;
                    expect(res.text).to.eql('Sender: SOS\n');
                    done();
                });
        });
    });
});