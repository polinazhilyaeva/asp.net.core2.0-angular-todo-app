using System.Collections.Generic;
using System.Threading.Tasks;

namespace TodoApp.Models
{
    public interface ITodoRepository
    {
        IEnumerable<Todo> GetAllTodos();
        IEnumerable<Todo> GetTodosByUsername(string username);
        Todo GetTodoById(int id);
        void AddTodo(Todo todo);
        Task<bool> SaveChangesAsync();
        void UpdateTodo(int id, Todo newTodo);
        void DeleteTodo(int id);
    }
}