namespace Backend.TodoApi.Dtos.V1;

public class TodoUpdateDto
{
   public string Title { get; set; } = string.Empty;
   public string? Description { get; set; }
   public bool IsCompleted { get; set; }
   public DateTime? DueAt { get; set; }
}
