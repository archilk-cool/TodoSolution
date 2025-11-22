using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Backend.TodoApi.Middleware;

public class ErrorHandlingMiddleware : IMiddleware
{
   private readonly ILogger<ErrorHandlingMiddleware> _logger;
   private readonly IHostEnvironment _env;

   public ErrorHandlingMiddleware(
       ILogger<ErrorHandlingMiddleware> logger,
       IHostEnvironment env)
   {
      _logger = logger;
      _env = env;
   }

   public async Task InvokeAsync(HttpContext context, RequestDelegate next)
   {
      try
      {
         await next(context);
      }
      catch (Exception ex)
      {
         _logger.LogError(ex, "Unhandled exception occurred");

         var problem = CreateProblemDetails(
             context,
             ex,
             HttpStatusCode.InternalServerError
         );

         context.Response.StatusCode = problem.Status ?? 500;
         context.Response.ContentType = "application/problem+json";

         var json = JsonSerializer.Serialize(problem);
         await context.Response.WriteAsync(json);
      }
   }

   private ProblemDetails CreateProblemDetails(
       HttpContext context,
       Exception ex,
       HttpStatusCode statusCode)
   {
      var problem = new ProblemDetails
      {
         Title = "An unexpected error occurred.",
         Status = (int)statusCode,
         Instance = context.Request.Path,
         Type = "https://httpstatuses.com/500"
      };

      // Include detailed exception info only in Development
      if (_env.IsDevelopment())
      {
         problem.Detail = ex.Message;
      }

      return problem;
   }
}
