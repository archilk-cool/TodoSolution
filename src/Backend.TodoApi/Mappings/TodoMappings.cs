using Backend.TodoApi.Models;
using Backend.TodoApi.Dtos.V1;

namespace Backend.TodoApi.Mappings;
public static class TodoMappings
{
   public static TodoResponseDto ToDto(this TodoItem item)
       => new TodoResponseDto
       {
          Id = item.Id,
          Title = item.Title,
          Description = item.Description,
          IsCompleted = item.IsCompleted,
          CreatedAt = item.CreatedAt,
          DueAt = item.DueAt
       };

   public static TodoItem ToEntity(this TodoCreateDto dto)
       => new TodoItem
       {
          Title = dto.Title,
          Description = dto.Description,
          DueAt = dto.DueAt,
          CreatedAt = DateTime.UtcNow
       };

   public static void MapToEntity(this TodoUpdateDto dto, TodoItem entity)
   {
      entity.Title = dto.Title;
      entity.Description = dto.Description;
      entity.IsCompleted = dto.IsCompleted;
      entity.DueAt = dto.DueAt;
   }
}
