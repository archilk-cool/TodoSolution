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

/// <summary>
/// Unit tests for <see cref="TodoService"/> using an EF Core InMemory database.
/// </summary>
/// <remarks>
/// Tests exercise the service's CRUD behavior and business rules (for example due date validation).
/// Each test creates a fresh in-memory database instance to ensure isolation and deterministic results.
/// </remarks>
public class TodoServiceTests
{
   /// <summary>
   /// Creates a new <see cref="AppDbContext"/> backed by a unique in-memory database.
   /// </summary>
   /// <remarks>
   /// Generating a new database name for each call ensures tests do not share state.
   /// Use this helper in tests to obtain a context configured for fast, in-memory operations.
   /// </remarks>
   private static AppDbContext CreateInMemoryContext()
   {
      var options = new DbContextOptionsBuilder<AppDbContext>()
          .UseInMemoryDatabase(Guid.NewGuid().ToString())
          .Options;
      return new AppDbContext(options);
   }

   /// <summary>
   /// GetAllAsync returns all persisted items ordered by Id.
   /// </summary>
   [Fact]
   public async Task GetAllAsync_ReturnsAllItems()
   {
      // Arrange: prepare in-memory DB with two sample entities
      using var db = CreateInMemoryContext();
      db.Todos.AddRange(
         new TodoItem { Title = "A", CreatedAt = DateTime.UtcNow },
         new TodoItem { Title = "B", CreatedAt = DateTime.UtcNow }
      );
      await db.SaveChangesAsync();

      var svc = new TodoService(db);

      // Act: retrieve all items
      var list = await svc.GetAllAsync();

      // Assert: both items are returned
      Assert.Equal(2, list.Count());
   }

   /// <summary>
   /// GetAsync returns the DTO when the entity exists.
   /// </summary>
   [Fact]
   public async Task GetAsync_ReturnsItem_WhenExists()
   {
      // Arrange
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "X", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);

      // Act
      var dto = await svc.GetAsync(item.Id);

      // Assert: dto is not null and values match
      Assert.NotNull(dto);
      Assert.Equal(item.Id, dto!.Id);
      Assert.Equal("X", dto.Title);
   }

   /// <summary>
   /// GetAsync returns null when no entity matches the id.
   /// </summary>
   [Fact]
   public async Task GetAsync_ReturnsNull_WhenNotFound()
   {
      // Arrange
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      // Act
      var dto = await svc.GetAsync(9999);

      // Assert
      Assert.Null(dto);
   }

   /// <summary>
   /// CreateAsync persists a new entity and returns the created DTO.
   /// </summary>
   [Fact]
   public async Task CreateAsync_PersistsAndReturnsDto()
   {
      // Arrange: fresh DB and service
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      var create = new TodoCreateDto
      {
         Title = "New Task",
         Description = "desc",
         DueDate = DateTime.UtcNow.AddHours(2)
      };

      // Act: create new item
      var result = await svc.CreateAsync(create);

      // Assert: returned DTO contains an Id and persisted entity exists
      Assert.NotNull(result);
      Assert.True(result.Id > 0);
      Assert.Equal("New Task", result.Title);

      var persisted = await db.Todos.FindAsync(result.Id);
      Assert.NotNull(persisted);
      Assert.Equal("New Task", persisted!.Title);
   }

   /// <summary>
   /// CreateAsync throws <see cref="ArgumentException"/> when due date is in the past.
   /// </summary>
   [Fact]
   public async Task CreateAsync_Throws_WhenDueDateInPast()
   {
      // Arrange
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      var create = new TodoCreateDto
      {
         Title = "Bad",
         DueDate = DateTime.UtcNow.AddHours(-2)
      };

      // Act & Assert: expect an ArgumentException for invalid due date
      await Assert.ThrowsAsync<ArgumentException>(() => svc.CreateAsync(create));
   }

   /// <summary>
   /// UpdateAsync returns true and applies changes when the entity exists.
   /// </summary>
   [Fact]
   public async Task UpdateAsync_ReturnsTrue_WhenExists()
   {
      // Arrange: seed an entity to update
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "Old", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);
      var update = new TodoUpdateDto { Title = "New", Description = "d", IsCompleted = true };

      // Act
      var ok = await svc.UpdateAsync(item.Id, update);

      // Assert: update succeeded and persisted values changed
      Assert.True(ok);
      var persisted = await db.Todos.FindAsync(item.Id);
      Assert.Equal("New", persisted!.Title);
      Assert.True(persisted.IsCompleted);
   }

   /// <summary>
   /// UpdateAsync returns false when the specified entity does not exist.
   /// </summary>
   [Fact]
   public async Task UpdateAsync_ReturnsFalse_WhenNotFound()
   {
      // Arrange
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      // Act
      var ok = await svc.UpdateAsync(12345, new TodoUpdateDto { Title = "X" });

      // Assert
      Assert.False(ok);
   }

   /// <summary>
   /// DeleteAsync removes an existing entity and returns true.
   /// </summary>
   [Fact]
   public async Task DeleteAsync_ReturnsTrue_WhenExists()
   {
      // Arrange: create an entity to delete
      using var db = CreateInMemoryContext();
      var item = new TodoItem { Title = "ToDelete", CreatedAt = DateTime.UtcNow };
      db.Todos.Add(item);
      await db.SaveChangesAsync();

      var svc = new TodoService(db);

      // Act
      var ok = await svc.DeleteAsync(item.Id);

      // Assert: deletion reported success and entity no longer exists
      Assert.True(ok);
      var persisted = await db.Todos.FindAsync(item.Id);
      Assert.Null(persisted);
   }

   /// <summary>
   /// DeleteAsync returns false when attempting to delete a non-existent entity.
   /// </summary>
   [Fact]
   public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
   {
      // Arrange
      using var db = CreateInMemoryContext();
      var svc = new TodoService(db);

      // Act
      var ok = await svc.DeleteAsync(99999);

      // Assert
      Assert.False(ok);
   }
}