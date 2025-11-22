namespace Backend.TodoApi.Dtos.V1;

/// <summary>
/// DTO returned to clients representing a persisted to-do item.
/// </summary>
public class TodoResponseDto
{
   /// <summary>
   /// Unique identifier of the to-do item.
   /// </summary>
   public int Id { get; set; }

   /// <summary>
   /// Title or short summary of the to-do item.
   /// </summary>
   public string Title { get; set; } = string.Empty;

   /// <summary>
   /// Optional detailed description.
   /// </summary>
   public string? Description { get; set; }

   /// <summary>
   /// Indicates whether the item has been completed.
   /// </summary>
   public bool IsCompleted { get; set; }

   /// <summary>
   /// UTC timestamp when the item was created.
   /// </summary>
   public DateTime CreatedAt { get; set; }

   /// <summary>
   /// Optional UTC due date/time for the item.
   /// </summary>
   public DateTime? DueDate { get; set; }
}
