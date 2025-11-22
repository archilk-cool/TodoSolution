using Backend.TodoApi.Models;
using Backend.TodoApi.Dtos.V1;

namespace Backend.TodoApi.Mappings;

/// <summary>
/// Provides lightweight extension methods to map between the domain <see cref="TodoItem"/>
/// entity and the versioned DTOs in <c>Dtos.V1</c>.
/// </summary>
/// <remarks>
/// These methods are intended to be simple, deterministic mappers:
/// - They should not contain business logic (validation, persistence, side-effects).
/// - <see cref="ToDto"/> is safe to use in LINQ projections when possible.
/// - <see cref="MapToEntity"/> mutates the supplied entity instance.
/// </remarks>
public static class TodoMappings
{
   /// <summary>
   /// Maps a <see cref="TodoItem"/> entity to a <see cref="TodoResponseDto"/>.
   /// </summary>
   /// <param name="item">Source entity. Must not be null.</param>
   /// <returns>A new <see cref="TodoResponseDto"/> populated from the entity.</returns>
   /// <remarks>
   /// Prefer using this method as a projection in queries (e.g. Select(...)) to avoid
   /// loading unnecessary data into memory when supported by the ORM/provider.
   /// </remarks>
   public static TodoResponseDto ToDto(this TodoItem item)
       => new TodoResponseDto
       {
          Id = item.Id,
          Title = item.Title,
          Description = item.Description,
          IsCompleted = item.IsCompleted,
          CreatedAt = item.CreatedAt,
          DueDate = item.DueDate
       };

   /// <summary>
   /// Creates a new <see cref="TodoItem"/> entity from a <see cref="TodoCreateDto"/>.
   /// </summary>
   /// <param name="dto">Creation DTO containing initial values. Must not be null.</param>
   /// <returns>A new <see cref="TodoItem"/> instance ready to be added to the data store.</returns>
   /// <remarks>
   /// This method sets <see cref="TodoItem.CreatedAt"/> to <c>DateTime.UtcNow</c> so that
   /// newly created entities have a deterministic creation timestamp.
   /// </remarks>
   public static TodoItem ToEntity(this TodoCreateDto dto)
       => new TodoItem
       {
          Title = dto.Title,
          Description = dto.Description,
          DueDate = dto.DueDate,
          CreatedAt = DateTime.UtcNow
       };

   /// <summary>
   /// Maps values from a <see cref="TodoUpdateDto"/> onto an existing <see cref="TodoItem"/>.
   /// </summary>
   /// <param name="dto">Update DTO containing new values.</param>
   /// <param name="entity">The tracked entity instance to update (mutated in-place).</param>
   /// <remarks>
   /// This method intentionally does not overwrite identity or creation metadata (e.g. Id, CreatedAt).
   /// It performs a shallow copy of user-editable properties.
   /// </remarks>
   public static void MapToEntity(this TodoUpdateDto dto, TodoItem entity)
   {
      // Apply user-provided updates to the tracked entity.
      entity.Title = dto.Title;
      entity.Description = dto.Description;
      entity.IsCompleted = dto.IsCompleted;
      entity.DueDate = dto.DueDate;
   }
}
