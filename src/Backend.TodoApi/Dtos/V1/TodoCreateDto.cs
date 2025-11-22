using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Dtos.V1;

public class TodoCreateDto
{
   [Required]
   [StringLength(200, MinimumLength = 3)]
   public string Title { get; set; } = string.Empty;

   [StringLength(2000)]
   public string? Description { get; set; }

   // Optional due date; if set, must be in the future – we can enforce this in service if needed
   [DataType(DataType.DateTime)]
   public DateTime? DueAt { get; set; }
}
