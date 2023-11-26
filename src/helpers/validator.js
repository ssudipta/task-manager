function validateTaskDetails(taskId, taskData){
    let isTaskExist = taskData.tasks.some(val=> val.taskId == taskId)
    if(isTaskExist) return false
    return true
}

function validateFieldsInTaskDetails(taskDetails){
    if(taskDetails && taskDetails.task && taskDetails.description && taskDetails.taskId && typeof(taskDetails.flag)=== "boolean"){
        return true
    }
    return false
}

module.exports = {validateTaskDetails, validateFieldsInTaskDetails}