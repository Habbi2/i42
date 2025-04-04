import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { Button } from '../components/common/Button';

const TaskDetails = () => {
    const { taskId } = useParams();
    const { getTaskById } = useContext(TaskContext);
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            const fetchedTask = await getTaskById(taskId);
            setTask(fetchedTask);
        };
        fetchTask();
    }, [taskId, getTaskById]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <Button onClick={() => {/* Handle edit task */}}>Edit Task</Button>
        </div>
    );
};

export default TaskDetails;