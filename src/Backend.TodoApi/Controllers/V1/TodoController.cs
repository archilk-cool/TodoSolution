using Asp.Versioning;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.TodoApi.Controllers.V1;

/// <summary>
/// API controller that exposes CRUD operations for to-do items (v1).
/// </summary>
/// <remarks>
/// Routes use API versioning: routes are formatted as <c>/api/v{version}/todo</c>.
/// This controller delegates business logic to an injected <see cref="ITodoService"/>.
/// </remarks>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class TodoController : ControllerBase
{
   private readonly ITodoService _service;

   /// <summary>
   /// Creates a new <see cref="TodoController"/>.
   /// </summary>
   /// <param name="service">Service responsible for to-do item operations.</param>
   public TodoController(ITodoService service)
   {
      _service = service;
   }

   /// <summary>
   /// Retrieves all to-do items.
   /// </summary>
   /// <returns>200 OK with a list of <see cref="TodoResponseDto"/>.</returns>
   [HttpGet]
   public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetAll()
       => Ok(await _service.GetAllAsync());

   /// <summary>
   /// Retrieves a single to-do item by its identifier.
   /// </summary>
   /// <param name="id">Numeric identifier of the to-do item.</param>
   /// <returns>
   /// 200 OK with the <see cref="TodoResponseDto"/> when found; otherwise 404 Not Found.
   /// </returns>
   [HttpGet("{id:int}")]
   public async Task<ActionResult<TodoResponseDto>> Get(int id)
   {
      var result = await _service.GetAsync(id);
      return result == null ? NotFound() : Ok(result);
   }

   /// <summary>
   /// Creates a new to-do item.
   /// </summary>
   /// <param name="dto">The creation DTO containing required fields for a new item.</param>
   /// <returns>
   /// 201 Created with the created <see cref="TodoResponseDto"/> and a Location header
   /// pointing to the newly created resource.
   /// </returns>
   [HttpPost]
   public async Task<ActionResult<TodoResponseDto>> Create([FromBody] TodoCreateDto dto)
   {
      var result = await _service.CreateAsync(dto);

      // CreatedAtAction returns 201 with a Location header referencing the Get action.
      // The route includes the API version; we explicitly provide version "1.0" here.
      return CreatedAtAction(nameof(Get),
          new { id = result.Id, version = "1.0" }, result);
   }

   /// <summary>
   /// Updates an existing to-do item.
   /// </summary>
   /// <param name="id">Identifier of the item to update.</param>
   /// <param name="dto">Update DTO containing the new values for the item.</param>
   /// <returns>
   /// 204 No Content when the update succeeds; 404 Not Found when the item does not exist.
   /// </returns>
   [HttpPut("{id:int}")]
   public async Task<IActionResult> Update(int id, [FromBody] TodoUpdateDto dto)
       => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

   /// <summary>
   /// Deletes a to-do item.
   /// </summary>
   /// <param name="id">Identifier of the item to delete.</param>
   /// <returns>
   /// 204 No Content when the deletion succeeds; 404 Not Found when the item does not exist.
   /// </returns>
   [HttpDelete("{id:int}")]
   public async Task<IActionResult> Delete(int id)
       => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
