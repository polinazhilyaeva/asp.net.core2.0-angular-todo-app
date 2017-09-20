using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Models;
using TodoApp.ViewModels;

namespace TodoApp.Controllers.Api
{
    [Route("/api/todos")]
    
    public class TodoController : Controller
    {
        private ITodoRepository _repository;
        private ILogger<TodoController> _logger;

        public TodoController(ITodoRepository repository, ILogger<TodoController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet("")]
        public IActionResult Get()
        {
            IActionResult response;

            try
            {
                var todoList = _repository.GetTodosByUsername(User.Identity.Name);

                var newTodoList = Mapper.Map<IEnumerable<TodoViewModel>>(todoList);

                response = Ok(newTodoList);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to get todos from database", ex.Message);
                response = BadRequest("Failed to get todos from database");
            }

            return response;
        }

        [HttpGet("/api/todos/{id}")]
        public IActionResult GetTodoById(int id)
        {
            IActionResult response;

            try
            {
                var todo = _repository.GetTodoById(id);

                if (todo == null)
                {
                    response = NotFound();
                    _logger.LogError("Todo was not found, todo id was = " + id);
                }

                var newTodo = Mapper.Map<TodoViewModel>(todo);

                response = Ok(newTodo);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to get todo from database", ex.Message);
                response = BadRequest("Failed to get todo from database");
            }

            return response;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody]TodoViewModel todo)
        {
            IActionResult response = BadRequest("Failed to update data in database");

            if (ModelState.IsValid)
            {
                var newTodo = Mapper.Map<Todo>(todo);

                _repository.UpdateTodo(id, newTodo);

                if (await _repository.SaveChangesAsync())
                {
                    response = new NoContentResult();
                }
            }

            return response;
        }

        [HttpDelete("/api/todos/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            IActionResult response = BadRequest("Failed to delete todo from database");

            var todo = _repository.GetTodoById(id);

            if (todo == null)
            {
                response = NotFound();
                _logger.LogError("Todo was not found, todo id was = " + id);
            }
            else
            {
                _repository.DeleteTodo(id);

                if (await _repository.SaveChangesAsync())
                {
                    response = new NoContentResult();
                }
                else
                {
                    _logger.LogError("Failed to delete todo from database");
                }
            }

            return response;
        }

        [HttpPost("")]
        public async Task<IActionResult> Post([FromBody]TodoViewModel todo)
        {
            IActionResult response = BadRequest(ModelState.Values);

            if (ModelState.IsValid)
            {
                var newTodo = Mapper.Map<Todo>(todo);

                newTodo.Username = User.Identity.Name;

                _repository.AddTodo(newTodo);

                if (await _repository.SaveChangesAsync())
                {
                    response = Created($"/api/todos/{newTodo.Id}", newTodo);
                }
            }
            
            return response;
        }
    }
}