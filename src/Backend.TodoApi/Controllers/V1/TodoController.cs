using Asp.Versioning;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.TodoApi.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class TodoController : ControllerBase
{
   private readonly ITodoService _service;

   public TodoController(ITodoService service)
   {
      _service = service;
   }

   [HttpGet]
   public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetAll()
       => Ok(await _service.GetAllAsync());

   [HttpGet("{id:int}")]
   public async Task<ActionResult<TodoResponseDto>> Get(int id)
   {
      var result = await _service.GetAsync(id);
      return result == null ? NotFound() : Ok(result);
   }

   [HttpPost]
   public async Task<ActionResult<TodoResponseDto>> Create([FromBody] TodoCreateDto dto)
   {
      var result = await _service.CreateAsync(dto);
      return CreatedAtAction(nameof(Get),
          new { id = result.Id, version = "1.0" }, result);
   }

   [HttpPut("{id:int}")]
   public async Task<IActionResult> Update(int id, [FromBody] TodoUpdateDto dto)
       => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

   [HttpDelete("{id:int}")]
   public async Task<IActionResult> Delete(int id)
       => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
