const express = require('express')
const fs = require('fs')
const path = require('path')
const taskData = require('../src/tasks.json')
const bodyParser = require('body-parser')
const { validateTaskDetails, validateFieldsInTaskDetails } = require('./helpers/validator')


const app = express()
app.use(bodyParser.json())

let port = 3000

app.get('/', (req,res)=>{
    return res.status(200).send('Hello World')
})

app.get('/tasks', (req, res)=> {
    return res.status(200).send(taskData)
})

app.get('/tasks/:taskIds', (req,res)=> {
    let taskIdParam = parseInt(req.params.taskIds)
    let tasksList = taskData.tasks
    let result = tasksList.filter( task=> task.taskId === taskIdParam)

    return res.status(200).send(result)
})

app.post('/tasks', (req,res)=> {
    let taskDetails = req.body

    if(validateTaskDetails(taskDetails.taskId, taskData)){
        let taskDataModified = JSON.parse(JSON.stringify(taskData))
        taskDataModified.tasks.push(taskDetails)
        let writePath = path.join(__dirname,'.','tasks.json')
        try{
            fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {encoding: 'utf8', flag: 'w'})
        }catch{
            return res.status(500).send("Server issue")
        }
        return res.status(200).send('New Task has been addeed')
    }else{
        return res.status(400).send('Incorrect details for sent request')
    }
})

app.put('/tasks/:taskId', (req,res)=> {
    let taskId = req.params.taskId
    let taskDetails = req.body

    if(!validateTaskDetails(taskDetails.taskId, taskData) && validateFieldsInTaskDetails(taskDetails)){
        let readFilePath = path.join(__dirname,'.','tasks.json')
        let taskDataFromFile = JSON.parse(fs.readFileSync(readFilePath, {encoding:'utf8', flag:'r'}))
        
        if(taskDataFromFile.tasks.length>0 && taskDataFromFile.tasks.some(val=>val.taskId== taskId)){
            taskDataFromFile.tasks.forEach(task=>{
                if(task.taskId== taskId){
                    task.task = taskDetails.task
                    task.description = taskDetails.description
                    task.flag = taskDetails.flag
                }
            })
            fs.writeFileSync(readFilePath,JSON.stringify(taskDataFromFile), {encoding: 'utf8', flag:'w'})
            return res.status(200).send('Task has been updated successfully')
        }else{
            return res.status(404).send('No data found for this ID')
        }


    } else {
        return res.status(400).send('Incorrect details or inadequate fields')
    }
})

app.delete('/tasks/:taskId', (req,res)=> {
    let taskIdFromParam = req.params.taskId

    if(!validateTaskDetails(taskIdFromParam, taskData)){
        console.log('task found')
        let filePath = path.join(__dirname,'.','tasks.json')
        let taskDataFromFile = JSON.parse(fs.readFileSync(filePath, {encoding:'utf8', flag:'r'}))

        let modifiedTasks = taskDataFromFile.tasks.filter(val=> val.taskId != taskIdFromParam)

        fs.writeFileSync(filePath,JSON.stringify(modifiedTasks), {encoding: 'utf8', flag:'w'})
        return res.status(200).send('Task has been deleted successfully')
    }else{
        return res.status(404).send('No task found for deletion')
    }
})

app.listen(port, (err)=> {
    if(err){
        console.log('Some error occured')
    }else{
        console.log('Server started on port 3000')
    }
})