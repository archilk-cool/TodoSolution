using Backend.TodoApi.Dtos.V1;

namespace Backend.TodoApi.Services;

/// <summary>
/// Defines the contract for operations that manage to-do items.
/// </summary>
/// <remarks>
/// Implementations encapsulate business rules and persistence details and are designed
/// to be consumed by controllers or other application services.
/// </remarks>
public interface ITodoService
{
   /// <summary>
   /// Retrieves all to-do items.
   /// </summary>
   /// <returns>
   /// A sequence of <see cref="TodoResponseDto"/> representing persisted to-do items.
   /// </returns>
   Task<IEnumerable<TodoResponseDto>> GetAllAsync();

   /// <summary>
   /// Retrieves a single to-do item by its identifier.
   /// </summary>
   /// <param name="id">The numeric identifier of the to-do item.</param>
   /// <returns>
   /// The <see cref="TodoResponseDto"/> when found; otherwise <c>null</c>.
   /// </returns>
   Task<TodoResponseDto?> GetAsync(int id);

   /// <summary>
   /// Creates a new to-do item from the provided DTO.
   /// </summary>
   /// <param name="dto">DTO containing values required to create the item.</param>
   /// <returns>The created item mapped to <see cref="TodoResponseDto"/>.</returns>
   /// <exception cref="ArgumentException">
   /// Thrown when the provided <c>DueDate</c> value (if present) is invalid (e.g. in the past).
   /// </exception>
   Task<TodoResponseDto> CreateAsync(TodoCreateDto dto);

   /// <summary>
   /// Updates an existing to-do item with values from the provided DTO.
   /// </summary>
   /// <param name="id">Identifier of the item to update.</param>
   /// <param name="dto">DTO containing updated values for the item.</param>
   /// <returns>
   /// <c>true</c> when the item existed and was updated; otherwise <c>false</c>.
   /// </returns>
   Task<bool> UpdateAsync(int id, TodoUpdateDto dto);

   /// <summary>
   /// Deletes a to-do item by identifier.
   /// </summary>
   /// <param name="id">Identifier of the item to delete.</param>
   /// <returns>
   /// <c>true</c> when the item existed and was deleted; otherwise <c>false</c>.
   /// </returns>
   Task<bool> DeleteAsync(int id);
}
