using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Enums
{
    public enum PriorityEnum : byte
    {
        Low = 1,
        Normal,
        High
    }
}
