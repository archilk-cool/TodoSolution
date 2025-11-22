using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Dtos.V1;

public class TodoUpdateDto
{
   [Required]
   [StringLength(200, MinimumLength = 3)]
   public string Title { get; set; } = string.Empty;

   [StringLength(2000)]
   public string? Description { get; set; }

   public bool IsCompleted { get; set; }

   [DataType(DataType.DateTime)]
   public DateTime? DueAt { get; set; }
}
