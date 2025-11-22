
using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Backend.TodoApi.Data;
using Backend.TodoApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS - allow Vite dev server
builder.Services.AddCors(options =>
{
   options.AddPolicy("AllowFrontend", policy =>
   {
      policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
   });
});

// Add services
builder.Services.AddControllers();

builder.Services
    .AddApiVersioning(options =>
    {
       options.DefaultApiVersion = new ApiVersion(1, 0);
       options.AssumeDefaultVersionWhenUnspecified = true;
       options.ReportApiVersions = true;
       options.ApiVersionReader = new UrlSegmentApiVersionReader();
    })
    .AddApiExplorer(options =>
    {
       options.GroupNameFormat = "'v'VVV";
       options.SubstituteApiVersionInUrl = true;
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core SQLite
var connectionString = builder.Configuration.GetConnectionString("Default") ?? "Data Source=todo.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

// Dependency Injection for services
builder.Services.AddScoped<ITodoService, TodoService>();

var app = builder.Build();

// Enable CORS *before* MapControllers
app.UseCors("AllowFrontend");

// Ensure DB created
using (var scope = app.Services.CreateScope())
{
   var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
   db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
   app.UseDeveloperExceptionPage();

   var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

   app.UseSwagger();
   app.UseSwaggerUI(options =>
   {
      foreach (var desc in provider.ApiVersionDescriptions)
      {
         options.SwaggerEndpoint(
             $"/swagger/{desc.GroupName}/swagger.json",
             desc.GroupName.ToUpperInvariant());
      }
   });
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
