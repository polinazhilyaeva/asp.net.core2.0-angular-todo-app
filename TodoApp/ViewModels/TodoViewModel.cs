using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Enums;

namespace TodoApp.ViewModels
{
    public class TodoViewModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        [Required]
        [EnumDataType(typeof(PriorityEnum), ErrorMessage = "Wrong priority. Choose from: Low(1), Normal(2), High(3)")]
        public PriorityEnum Priority { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DueDateTime { get; set; }

        [StringLength(250)]
        public string Comment { get; set; }
    }
}
