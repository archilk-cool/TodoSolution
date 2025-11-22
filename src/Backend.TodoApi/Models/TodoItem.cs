
using System.ComponentModel.DataAnnotations;

namespace Backend.TodoApi.Models
{
    public class TodoItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueAt { get; set; }
    }
}
