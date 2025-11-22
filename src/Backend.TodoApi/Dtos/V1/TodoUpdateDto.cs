using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Dtos.V1;

/// <summary>
/// DTO used to update an existing to-do item.
/// </summary>
/// <remarks>
/// Contains fields that can be modified. Validation attributes ensure client input is within allowed ranges.
/// The service layer is responsible for applying additional business rules (e.g. due date validation).
/// </remarks>
public class TodoUpdateDto
{
   /// <summary>
   /// Updated title for the to-do item.
   /// </summary>
   /// <remarks>
   /// Required. Must be between 3 and 200 characters.
   /// </remarks>
   [Required]
   [StringLength(200, MinimumLength = 3)]
   public string Title { get; set; } = string.Empty;

   /// <summary>
   /// Updated optional description.
   /// </summary>
   /// <remarks>
   /// Maximum length of 2000 characters.
   /// </remarks>
   [StringLength(2000)]
   public string? Description { get; set; }

   /// <summary>
   /// Flag indicating whether the item is completed.
   /// </summary>
   public bool IsCompleted { get; set; }

   /// <summary>
   /// Optional UTC due date/time after the update.
   /// </summary>
   /// <remarks>
   /// Nullable — if provided the application should ensure it is not a past date.
   /// </remarks>
   [DataType(DataType.DateTime)]
   public DateTime? DueDate { get; set; }
}
