using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.TodoApi.Data;
using Backend.TodoApi.Dtos.V1;
using Backend.TodoApi.Models;
using Backend.TodoApi.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.TodoApi.Tests;

public class TodoServiceTests
{
   private static AppDbContext CreateInMemoryContext()
   {
      var options = new DbContextOptionsBuilder<AppDbContext>()
          .UseInMemoryDatabase(Guid.NewGuid().ToString())
          .Options;
      return new AppDbContext(options);
   }

   [Fact]
   public async Task GetAllAsync_ReturnsAllItems()
   {
      using var db = CreateInMemoryContext();
      db.Todos.AddRange(
         new TodoItem { Title = "A", CreatedAt = DateTime.UtcNow },
         new TodoItem { Title = "B", CreatedAt = DateTime.UtcNow }
      );
      await db.SaveChangesAsync();

      var svc = new TodoService(db);
      var list = await svc.GetAllAsync();

      Assert.Equal(2, list.Count());
   }

   [Fact]
   public async Task GetAsync_ReturnsItem_WhenExists()
   {
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "X", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);
      var dto = await svc.GetAsync(item.Id);

      Assert.NotNull(dto);
      Assert.Equal(item.Id, dto!.Id);
      Assert.Equal("X", dto.Title);
   }

   [Fact]
   public async Task GetAsync_ReturnsNull_WhenNotFound()
   {
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);
      var dto = await svc.GetAsync(9999);
      Assert.Null(dto);
   }

   [Fact]
   public async Task CreateAsync_PersistsAndReturnsDto()
   {
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      var create = new TodoCreateDto
      {
         Title = "New Task",
         Description = "desc",
         DueDate = DateTime.UtcNow.AddHours(2)
      };

      var result = await svc.CreateAsync(create);

      Assert.NotNull(result);
      Assert.True(result.Id > 0);
      Assert.Equal("New Task", result.Title);

      // verify persisted
      var persisted = await db.Todos.FindAsync(result.Id);
      Assert.NotNull(persisted);
      Assert.Equal("New Task", persisted!.Title);
   }

   [Fact]
   public async Task CreateAsync_Throws_WhenDueDateInPast()
   {
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      var create = new TodoCreateDto
      {
         Title = "Bad",
         DueDate = DateTime.UtcNow.AddHours(-2)
      };

      await Assert.ThrowsAsync<ArgumentException>(() => svc.CreateAsync(create));
   }

   [Fact]
   public async Task UpdateAsync_ReturnsTrue_WhenExists()
   {
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "Old", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);
      var update = new TodoUpdateDto { Title = "New", Description = "d", IsCompleted = true };
      var ok = await svc.UpdateAsync(item.Id, update);

      Assert.True(ok);
      var persisted = await db.Todos.FindAsync(item.Id);
      Assert.Equal("New", persisted!.Title);
      Assert.True(persisted.IsCompleted);
   }

   [Fact]
   public async Task UpdateAsync_ReturnsFalse_WhenNotFound()
   {
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);
      var ok = await svc.UpdateAsync(12345, new TodoUpdateDto { Title = "X" });
      Assert.False(ok);
   }

   [Fact]
   public async Task DeleteAsync_ReturnsTrue_WhenExists()
   {
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "ToDelete", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);
      var ok = await svc.DeleteAsync(item.Id);

      Assert.True(ok);
      var persisted = await db.Todos.FindAsync(item.Id);
      Assert.Null(persisted);
   }

   [Fact]
   public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
   {
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);
      var ok = await svc.DeleteAsync(99999);
      Assert.False(ok);
   }
}