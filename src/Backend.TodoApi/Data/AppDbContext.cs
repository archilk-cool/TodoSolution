using Microsoft.EntityFrameworkCore;
using Backend.TodoApi.Models;

namespace Backend.TodoApi.Data
{
    /// <summary>
    /// Entity Framework Core database context for the application.
    /// </summary>
    /// <remarks>
    /// Register this context with dependency injection (for example in <c>Program.cs</c>)
    /// using <see cref="DbContextOptions{TContext}"/>. Use EF Core migrations to create
    /// and evolve the database schema that corresponds to the <see cref="DbSet{TEntity}"/>
    /// properties on this class.
    /// </remarks>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Creates a new instance of <see cref="AppDbContext"/>.
        /// </summary>
        /// <param name="options">The options to control the context behavior (connection string, provider, etc.).</param>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        /// <summary>
        /// Represents the collection of to-do items in the database.
        /// </summary>
        /// <remarks>
        /// This property maps to a database table (commonly named "Todos"). It is initialized
        /// with the null-forgiving operator because EF Core will provide a functional instance
        /// at runtime. Query and update through this <see cref="DbSet{TEntity}"/>.
        /// </remarks>
        public DbSet<TodoItem> Todos { get; set; } = null!;
    }
}
