import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todo.models.js";


const createTodo = asyncHandler(async (req, res) => {

    const {description, completed} = req.body;
    const todo = await Todo.create({ description, completed, user: req.user._id })

    if(!todo){
        throw new ApiError(400, "Failed to create todo");
    }

    return res.status(200).json(new ApiResponse( 201, "Created todos successfully", todo));

})

const getTodo = asyncHandler(async (req, res) => {
   
    const todo = await Todo.find({
        user: req.user._id
    })
   
    
    if(!todo){
        throw new ApiError(404, "Todo not found");
    }
    return res.status(200).json(new ApiResponse(200, "Todo retrieved successfully", todo));
});

const deleteTodo = asyncHandler(async (req, res) =>{
    const {id} = req.params
    const todo = await Todo.findByIdAndDelete({
        _id: id,
        user: req.user._id
    })
    if(!todo){
        throw new ApiError(404, "Todo not found");
    }
    return res.status(200).json(new ApiResponse(200, "Deleted todo successfully"));
})

const updateTodo = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {completed} = req.body
    const todo = await Todo.findByIdAndUpdate(
        {_id: id, user: req.user._id},
        { completed },
        { new: true }
    )
    if(!todo){
        throw new ApiError(404, "Failure updating todo");
    }
    return res.status(200).json(new ApiResponse(200, "Updated todo successfully", todo));
})

export { createTodo, getTodo, deleteTodo, updateTodo };