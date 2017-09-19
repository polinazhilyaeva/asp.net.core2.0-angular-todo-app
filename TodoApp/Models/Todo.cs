using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Enums;

namespace TodoApp.Models
{
    public class Todo
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public PriorityEnum Priority { get; set; }
        
        public DateTime DueDateTime { get; set; }

        public string Comment { get; set; }

        public string Username { get; set; }
    }
}
