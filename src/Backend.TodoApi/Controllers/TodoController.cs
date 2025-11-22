
using Microsoft.AspNetCore.Mvc;
using Backend.TodoApi.Data;
using Backend.TodoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly AppDbContext _db;

    public TodoController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _db.Todos.OrderBy(t => t.Id).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _db.Todos.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TodoItem todo)
    {
        todo.Id = 0;
        todo.CreatedAt = DateTime.UtcNow;
        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = todo.Id }, todo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TodoItem todo)
    {
        var existing = await _db.Todos.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = todo.Title;
        existing.Description = todo.Description;
        existing.IsCompleted = todo.IsCompleted;
        existing.DueAt = todo.DueAt;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.Todos.FindAsync(id);
        if (existing == null) return NotFound();
        _db.Todos.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
