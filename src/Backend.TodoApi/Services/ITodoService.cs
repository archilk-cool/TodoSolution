using Backend.TodoApi.Dtos.V1;

namespace Backend.TodoApi.Services;

public interface ITodoService
{
   Task<IEnumerable<TodoResponseDto>> GetAllAsync();
   Task<TodoResponseDto?> GetAsync(int id);
   Task<TodoResponseDto> CreateAsync(TodoCreateDto dto);
   Task<bool> UpdateAsync(int id, TodoUpdateDto dto);
   Task<bool> DeleteAsync(int id);
}
