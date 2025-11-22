using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Models
{
    /// <summary>
    /// Data transfer object that represents a single to-do item.
    /// </summary>
    /// <remarks>
    /// This model is used by the API to create, return and persist to-do items.
    /// Properties are annotated with validation attributes that the framework will honor.
    /// </remarks>
    public class TodoItem
    {
        /// <summary>
        /// Primary key / unique identifier for the to-do item.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Short title or summary of the to-do item.
        /// </summary>
        /// <remarks>
        /// This value is required and cannot be null or empty. Validation is enforced by the
        /// <see cref="RequiredAttribute"/>.
        /// </remarks>
        [Required]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Optional detailed description for the to-do item.
        /// </summary>
        /// <remarks>
        /// Nullable; include additional context, acceptance criteria, links, etc.
        /// </remarks>
        public string? Description { get; set; }

        /// <summary>
        /// Indicates whether the to-do item has been completed.
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// UTC timestamp when the to-do item was created.
        /// </summary>
        /// <remarks>
        /// Defaults to <c>DateTime.UtcNow</c> to avoid timezone ambiguity across clients.
        /// </remarks>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Optional UTC due date/time for the to-do item.
        /// </summary>
        /// <remarks>
        /// Nullable — use when the item has a deadline. Prefer UTC for consistency.
        /// </remarks>
        public DateTime? DueDate { get; set; }
    }
}
