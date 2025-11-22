using Asp.Versioning;
using Backend.TodoApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.TodoApi.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class TodoController : ControllerBase
{
   private readonly AppDbContext _db;

   public TodoController(AppDbContext db)
   {
      _db = db;
   }

   // GET api/v1/todo
   [HttpGet]
   public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetAll()
   {
      var items = await _db.Todos
          .OrderBy(t => t.Id)
          .Select(t => t.ToDto())   // <-- map to DTOs
          .ToListAsync();

      return Ok(items);
   }

   // GET api/v1/todo/5
   [HttpGet("{id:int}")]
   public async Task<ActionResult<TodoResponseDto>> Get(int id)
   {
      var item = await _db.Todos.FindAsync(id);
      if (item == null) return NotFound();

      return Ok(item.ToDto());
   }

   // POST api/v1/todo
   [HttpPost]
   public async Task<ActionResult<TodoResponseDto>> Create([FromBody] TodoCreateDto dto)
   {
      var entity = dto.ToEntity();
      _db.Todos.Add(entity);

      await _db.SaveChangesAsync();

      var response = entity.ToDto();

      return CreatedAtAction(nameof(Get),
          new { id = entity.Id, version = "1.0" },
          response);
   }

   // PUT api/v1/todo/5
   [HttpPut("{id:int}")]
   public async Task<IActionResult> Update(int id, [FromBody] TodoUpdateDto dto)
   {
      var existing = await _db.Todos.FindAsync(id);
      if (existing == null) return NotFound();

      dto.MapToEntity(existing);

      await _db.SaveChangesAsync();
      return NoContent();
   }

   // DELETE api/v1/todo/5
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
