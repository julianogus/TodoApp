const { Router }  = require("express");
const { decryptTodo, encryptTodo } = require('./assets/encryptDecryptData');
const router = new Router();
const crypto = require('crypto');
const passport = require('passport');
require('dotenv').config();

const Todos = require('../models/index.js').Todos;

const checkIfConnected = (req,res,next) => {
    if(req.isAuthenticated()){
        //req.user = req.session.passport.user;
        return next();
    } else {
        //res.redirect('/login');
        res.status(200).send();
    }
}

const getDecryptedTodos = (todosEncrypted) => {
    const todos = [];
    let encryptedTodoData;
    let todo;

    todosEncrypted.forEach(element => {
        encryptedTodoData = {
            datum: element.todo,
            iv: element.todoIv,
            authTag: element.todoAuthTag
        }

        const todoDecrypted = decryptTodo(encryptedTodoData);

        todo = {
            id: element.id,
            todo: todoDecrypted,
            isDone: element.isDone,
            updatedAt: element.updatedAt,
        }

        todos.push(todo);
    })

    return todos;

}

router.post('/addTodo', checkIfConnected, async (req,res) => {

    const todo = req.body.title;
    const encryptedTodoData = encryptTodo(todo);

    try{
        const todo = await Todos.create({
            todo: encryptedTodoData.datum,
            todoIv: encryptedTodoData.iv,
            todoAuthTag: encryptedTodoData.authTag,
            userId: req.session.passport.user,
            isDone: false,
        })
        res.json(todo);
    } catch(err){
        res.status(401).json(err);
    }
})

/*
router.get('/testing', async (req,res,next) => {
    const todos = await Todos.findAll({
        order: [
            ['id', 'ASC']
        ]
    });
    res.json(todos);
})
*/

router.get('/getTodos', checkIfConnected, async (req, res) => {
    try{
        const todosEncrypted = await Todos.findAll({
            order: [
                ['id', 'ASC']
            ],
            where: {
                userId: req.session.passport.user,
                isDone: false
            }
        });

        const todos =  getDecryptedTodos(todosEncrypted);

        res.json(todos);
    } catch(err){
        res.json(err);
    }
})

router.get('/getDoneTodos', checkIfConnected, async (req, res) => {
    try{
        const doneTodosEncrypted = await Todos.findAll({
            order: [
                ['id', 'ASC']
            ],
            where: {
                userId: req.session.passport.user,
                isDone: true
            }
        });
        const todos =  getDecryptedTodos(doneTodosEncrypted);
        res.json(todos);
    } catch(err){
        res.json(err);
    }
})

router.get('/changeTodo/:id', checkIfConnected, async (req, res) => {

    const todoFind = await Todos.findAll({
        where: {
            id: req.params.id,
            userId: req.session.passport.user
        },
    })

    const todo = todoFind[0];

    Todos.update(
        {isDone: !todo.isDone},
        {
            where: {
                id: todo.id
            },
        }
    )

    todo.isDone = !todo.isDone;

    res.json(todo)

})

router.delete('/deleteTodo/:id', checkIfConnected, async (req,res) => {

    const todoFind = await Todos.findAll({
        where: {
            id: req.params.id,
        },
    })

    const todo = todoFind[0];

    if(todo.userId === req.session.passport.user){
        todo.destroy();
        res.json({ ans: "done" });
    } else {
        res.status(403).json({err: "forbidden"});
    }

})

module.exports = router;