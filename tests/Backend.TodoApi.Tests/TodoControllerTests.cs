using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.TodoApi.Controllers.V1;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Backend.TodoApi.Tests;

public class TodoControllerTests
{
   [Fact]
   public async Task GetAll_ReturnsOk_WithItems()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAllAsync()).ReturnsAsync(new List<TodoResponseDto>
      {
         new() { Id = 1, Title = "A" },
         new() { Id = 2, Title = "B" }
      });

      var ctl = new TodoController(mock.Object);
      var result = await ctl.GetAll();

      var ok = Assert.IsType<OkObjectResult>(result.Result);
      var items = Assert.IsAssignableFrom<IEnumerable<TodoResponseDto>>(ok.Value);
      Assert.Equal(2, System.Linq.Enumerable.Count(items));
   }

   [Fact]
   public async Task Get_ReturnsNotFound_WhenNull()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAsync(5)).ReturnsAsync((TodoResponseDto?)null);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Get(5);

      Assert.IsType<NotFoundResult>(result.Result);
   }

   [Fact]
   public async Task Get_ReturnsOk_WhenFound()
   {
      var dto = new TodoResponseDto { Id = 3, Title = "Found" };
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.GetAsync(3)).ReturnsAsync(dto);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Get(3);

      var ok = Assert.IsType<OkObjectResult>(result.Result);
      Assert.Equal(dto, ok.Value);
   }

   [Fact]
   public async Task Create_ReturnsCreatedAtAction()
   {
      var create = new TodoCreateDto { Title = "C" };
      var created = new TodoResponseDto { Id = 42, Title = "C" };

      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.CreateAsync(create)).ReturnsAsync(created);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Create(create);

      var createdAt = Assert.IsType<CreatedAtActionResult>(result.Result);
      Assert.Equal(nameof(TodoController.Get), createdAt.ActionName);
      Assert.Equal(created, createdAt.Value);
      Assert.Equal(42, createdAt.RouteValues!["id"]);
      Assert.Equal("1.0", createdAt.RouteValues!["version"]);
   }

   [Fact]
   public async Task Update_ReturnsNoContent_WhenTrue()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.UpdateAsync(1, It.IsAny<TodoUpdateDto>())).ReturnsAsync(true);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Update(1, new TodoUpdateDto { Title = "T" });

      Assert.IsType<NoContentResult>(result);
   }

   [Fact]
   public async Task Update_ReturnsNotFound_WhenFalse()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.UpdateAsync(99, It.IsAny<TodoUpdateDto>())).ReturnsAsync(false);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Update(99, new TodoUpdateDto { Title = "T" });

      Assert.IsType<NotFoundResult>(result);
   }

   [Fact]
   public async Task Delete_ReturnsNoContent_WhenTrue()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.DeleteAsync(2)).ReturnsAsync(true);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Delete(2);

      Assert.IsType<NoContentResult>(result);
   }

   [Fact]
   public async Task Delete_ReturnsNotFound_WhenFalse()
   {
      var mock = new Mock<ITodoService>();
      mock.Setup(s => s.DeleteAsync(999)).ReturnsAsync(false);

      var ctl = new TodoController(mock.Object);
      var result = await ctl.Delete(999);

      Assert.IsType<NotFoundResult>(result);
   }
}