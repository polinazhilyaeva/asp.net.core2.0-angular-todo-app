using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Models
{
    public class TodoRepository : ITodoRepository
    {
        private TodoContext _context;
        private ILogger<TodoRepository> _logger;

        public TodoRepository(TodoContext context, ILogger<TodoRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IEnumerable<Todo> GetAllTodos()
        {
            return _context.Todos.ToList();
        }

        public IEnumerable<Todo> GetTodosByUsername(string username)
        {
            return _context.Todos
                .Where(t => t.Username == username)
                .ToList();
        }

        public Todo GetTodoById(int id)
        {
            return _context.Todos
                .Where(t => t.Id == id)
                .FirstOrDefault();
        }

        public void AddTodo(Todo todo)
        {
            _context.Add(todo);
        }

        public void UpdateTodo(int id, Todo newTodo)
        {
            Todo oldTodo = GetTodoById(id);

            if (oldTodo != null)
            {
                oldTodo.Name = newTodo.Name;
                oldTodo.Priority = newTodo.Priority;
                oldTodo.DueDateTime = newTodo.DueDateTime;
                oldTodo.Comment = newTodo.Comment;

                _context.Todos.Update(oldTodo);
            }
        }

        public void DeleteTodo(int id)
        {
            Todo todo = GetTodoById(id);

            if (todo != null)
            {
                _context.Todos.Remove(todo);
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}
