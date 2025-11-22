using Backend.TodoApi.Data;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Mappings;
using Backend.TodoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.TodoApi.Services;

public class TodoService : ITodoService
{
    private readonly AppDbContext _db;

    public TodoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TodoResponseDto>> GetAllAsync()
    {
        return await _db.Todos
            .OrderBy(t => t.Id)
            .Select(t => t.ToDto())
            .ToListAsync();
    }

    public async Task<TodoResponseDto?> GetAsync(int id)
    {
        var item = await _db.Todos.FindAsync(id);
        return item?.ToDto();
    }

    public async Task<TodoResponseDto> CreateAsync(TodoCreateDto dto)
    {
        var entity = dto.ToEntity();
        _db.Todos.Add(entity);
        await _db.SaveChangesAsync();
        return entity.ToDto();
    }

    public async Task<bool> UpdateAsync(int id, TodoUpdateDto dto)
    {
        var entity = await _db.Todos.FindAsync(id);
        if (entity == null) return false;

        dto.MapToEntity(entity);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.Todos.FindAsync(id);
        if (entity == null) return false;

        _db.Todos.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }
}
