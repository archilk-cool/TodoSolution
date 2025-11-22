using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Dtos.V1;

/// <summary>
/// DTO used when creating a new to-do item.
/// </summary>
/// <remarks>
/// Validation attributes are applied to enforce required fields and length limits.
/// Business rules that require context (for example ensuring <see cref="DueDate"/> is in the future)
/// are enforced in the service layer.
/// </remarks>
public class TodoCreateDto
{
   /// <summary>
   /// Short title or summary for the to-do item.
   /// </summary>
   /// <remarks>
   /// Required. Must be between 3 and 200 characters.
   /// </remarks>
   [Required]
   [StringLength(200, MinimumLength = 3)]
   public string Title { get; set; } = string.Empty;

   /// <summary>
   /// Optional detailed description for the to-do item.
   /// </summary>
   /// <remarks>
   /// Maximum length of 2000 characters.
   /// </remarks>
   [StringLength(2000)]
   public string? Description { get; set; }

   /// <summary>
   /// Optional UTC due date/time for the item.
   /// </summary>
   /// <remarks>
   /// Nullable — if provided the service enforces that the due date cannot be in the past.
   /// <see cref="DataType.DateTime"/> indicates the expected format but does not validate value range.
   /// </remarks>
   [DataType(DataType.DateTime)]
   public DateTime? DueDate { get; set; }
}
