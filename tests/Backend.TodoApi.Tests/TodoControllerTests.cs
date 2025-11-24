using Backend.TodoApi.Controllers.V1;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Backend.TodoApi.Tests;

/// <summary>
/// Unit tests for <see cref="TodoController"/>.
/// </summary>
/// <remarks>
/// Uses Moq to isolate the controller from the service implementation and verifies
/// that the controller returns the expected IActionResult types and payloads for
/// a variety of service responses.
/// 
/// No real database or service layer is used. This ensures tests remain isolated, 
/// fast, and focused on controller logic only (routing behavior, return types, etc.).
/// 
/// Each test follows the standard AAA structure:
///    • Arrange – configure mocks and controller
///    • Act     – call the controller action
///    • Assert  – validate the returned IActionResult
/// </remarks>
public class TodoControllerTests
{
   /// <summary>
   /// Verifies GetAll returns 200 OK with the sequence of DTOs provided by the service.
   /// </summary>
   [Fact]
   public async Task GetAll_ReturnsOk_WithItems()
   {
      // Arrange: mock service returns two items
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAllAsync()).ReturnsAsync(new List<TodoResponseDto>
      {
         new() { Id = 1, Title = "A" },
         new() { Id = 2, Title = "B" }
      });

      var ctl = new TodoController(mock.Object);

      // Act: call controller action
      var result = await ctl.GetAll();

      // Assert: response is OkObjectResult containing the expected items
      var ok = Assert.IsType<OkObjectResult>(result.Result);
      var items = Assert.IsAssignableFrom<IEnumerable<TodoResponseDto>>(ok.Value);
      Assert.Equal(2, System.Linq.Enumerable.Count(items));
   }

   /// <summary>
   /// Verifies Get returns 404 NotFound when service returns null for the requested id.
   /// </summary>
   [Fact]
   public async Task Get_ReturnsNotFound_WhenNull()
   {
      // Arrange: service returns null for id 5
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAsync(5)).ReturnsAsync((TodoResponseDto?)null);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Get(5);

      // Assert
      Assert.IsType<NotFoundResult>(result.Result);
   }

   /// <summary>
   /// Verifies Get returns 200 OK with the DTO when the service finds an item.
   /// </summary>
   [Fact]
   public async Task Get_ReturnsOk_WhenFound()
   {
      // Arrange
      var dto = new TodoResponseDto { Id = 3, Title = "Found" };
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAsync(3)).ReturnsAsync(dto);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Get(3);

      // Assert: OkObjectResult contains the same DTO instance/value
      var ok = Assert.IsType<OkObjectResult>(result.Result);
      Assert.Equal(dto, ok.Value);
   }

   /// <summary>
   /// Verifies Create returns CreatedAtAction with correct route values and payload.
   /// </summary>
   [Fact]
   public async Task Create_ReturnsCreatedAtAction()
   {
      // Arrange: prepare create DTO and expected returned DTO
      var create = new TodoCreateDto { Title = "C" };
      var created = new TodoResponseDto { Id = 42, Title = "C" };

      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.CreateAsync(create)).ReturnsAsync(created);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Create(create);

      // Assert: CreatedAtAction points to Get and includes version/id route values
      var createdAt = Assert.IsType<CreatedAtActionResult>(result.Result);
      Assert.Equal(nameof(TodoController.Get), createdAt.ActionName);
      Assert.Equal(created, createdAt.Value);
      Assert.Equal(42, createdAt.RouteValues!["id"]);
      Assert.Equal("1.0", createdAt.RouteValues!["version"]);
   }

   /// <summary>
   /// Verifies Update returns 204 NoContent when the service indicates success.
   /// </summary>
   [Fact]
   public async Task Update_ReturnsNoContent_WhenTrue()
   {
      // Arrange: service will return true indicating update succeeded
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.UpdateAsync(1, It.IsAny<TodoUpdateDto>())).ReturnsAsync(true);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Update(1, new TodoUpdateDto { Title = "T" });

      // Assert
      Assert.IsType<NoContentResult>(result);
   }

   /// <summary>
   /// Verifies Update returns 404 NotFound when the service indicates the item wasn't found.
   /// </summary>
   [Fact]
   public async Task Update_ReturnsNotFound_WhenFalse()
   {
      // Arrange: service returns false for non-existing id
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.UpdateAsync(99, It.IsAny<TodoUpdateDto>())).ReturnsAsync(false);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Update(99, new TodoUpdateDto { Title = "T" });

      // Assert
      Assert.IsType<NotFoundResult>(result);
   }

   /// <summary>
   /// Verifies Delete returns 204 NoContent when deletion succeeds.
   /// </summary>
   [Fact]
   public async Task Delete_ReturnsNoContent_WhenTrue()
   {
      // Arrange
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.DeleteAsync(2)).ReturnsAsync(true);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Delete(2);

      // Assert
      Assert.IsType<NoContentResult>(result);
   }

   /// <summary>
   /// Verifies Delete returns 404 NotFound when the item to delete does not exist.
   /// </summary>
   [Fact]
   public async Task Delete_ReturnsNotFound_WhenFalse()
   {
      // Arrange
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.DeleteAsync(999)).ReturnsAsync(false);

      var ctl = new TodoController(mock.Object);

      // Act
      var result = await ctl.Delete(999);

      // Assert
      Assert.IsType<NotFoundResult>(result);
   }
}