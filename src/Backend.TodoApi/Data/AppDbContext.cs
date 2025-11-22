
using Microsoft.EntityFrameworkCore;
using Backend.TodoApi.Models;

namespace Backend.TodoApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<TodoItem> Todos { get; set; } = null!;
    }
}
