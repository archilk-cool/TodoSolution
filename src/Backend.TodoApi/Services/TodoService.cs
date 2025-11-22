using Backend.TodoApi.Data;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Backend.TodoApi.Services;

/// <summary>
/// Service that encapsulates business logic and data access for to-do items.
/// </summary>
/// <remarks>
/// This implementation uses Entity Framework Core via <see cref="AppDbContext"/> to
/// perform CRUD operations and maps entities to/from DTOs using mapping helpers.
/// Validation rules that are not easily expressed with attributes (for example,
/// "Due date must be in the future") are enforced here so controllers can remain thin.
/// </remarks>
public class TodoService : ITodoService
{
   /// <summary>
   /// Database context used to read and persist to-do items.
   /// </summary>
   private readonly AppDbContext _db;

   /// <summary>
   /// Creates a new instance of <see cref="TodoService"/>.
   /// </summary>
   /// <param name="db">EF Core <see cref="AppDbContext"/> injected by DI.</param>
   public TodoService(AppDbContext db)
   {
      _db = db;
   }

   /// <summary>
   /// Retrieves all to-do items ordered by Id.
   /// </summary>
   /// <returns>A sequence of <see cref="TodoResponseDto"/> representing stored items.</returns>
   public async Task<IEnumerable<TodoResponseDto>> GetAllAsync()
   {
      // Project entities to DTOs in the database query to avoid loading unnecessary data.
      return await _db.Todos
          .OrderBy(t => t.Id)
          .Select(t => t.ToDto())
          .ToListAsync();
   }

   /// <summary>
   /// Retrieves a single to-do item by identifier.
   /// </summary>
   /// <param name="id">Numeric id of the item to fetch.</param>
   /// <returns>The matching <see cref="TodoResponseDto"/> or null when not found.</returns>
   public async Task<TodoResponseDto?> GetAsync(int id)
   {
      // Use FindAsync which will use the change tracker cache when available.
      var item = await _db.Todos.FindAsync(id);
      return item?.ToDto();
   }

   /// <summary>
   /// Creates a new to-do item from the provided creation DTO.
   /// </summary>
   /// <param name="dto">Creation DTO containing required fields for the new item.</param>
   /// <returns>The created item mapped to <see cref="TodoResponseDto"/>.</returns>
   /// <exception cref="ArgumentException">Thrown when the supplied due date is in the past.</exception>
   public async Task<TodoResponseDto> CreateAsync(TodoCreateDto dto)
   {
      // Enforce business rule: if DueDate is provided it must not be in the past.
      if (dto.DueDate.HasValue && dto.DueDate.Value < DateTime.UtcNow)
      {
         throw new ArgumentException("Due date cannot be in the past.");
      }

      // Map DTO to entity, add and persist.
      var entity = dto.ToEntity();
      _db.Todos.Add(entity);
      await _db.SaveChangesAsync();

      // Return the persisted entity as a response DTO (Id and default fields will be populated).
      return entity.ToDto();
   }

   /// <summary>
   /// Updates an existing to-do item with values from the update DTO.
   /// </summary>
   /// <param name="id">Identifier of the item to update.</param>
   /// <param name="dto">DTO containing updated values.</param>
   /// <returns>True when the item existed and was updated; otherwise false.</returns>
   public async Task<bool> UpdateAsync(int id, TodoUpdateDto dto)
   {
      // Load the entity; return false when not found so controller can respond 404.
      var entity = await _db.Todos.FindAsync(id);
      if (entity == null) return false;

      // Map the incoming values onto the tracked entity and persist.
      dto.MapToEntity(entity);
      await _db.SaveChangesAsync();
      return true;
   }

   /// <summary>
   /// Deletes a to-do item by id.
   /// </summary>
   /// <param name="id">Identifier of the item to delete.</param>
   /// <returns>True when the item existed and was deleted; otherwise false.</returns>
   public async Task<bool> DeleteAsync(int id)
   {
      var entity = await _db.Todos.FindAsync(id);
      if (entity == null) return false;

      // Remove tracked entity and save changes.
      _db.Todos.Remove(entity);
      await _db.SaveChangesAsync();
      return true;
   }
}
