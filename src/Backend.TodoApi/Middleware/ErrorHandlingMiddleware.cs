using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Backend.TodoApi.Middleware;

/// <summary>
/// Middleware that catches unhandled exceptions from the request pipeline,
/// logs the exception and returns a standardized RFC 7807 Problem Details response.
/// </summary>
/// <remarks>
/// Register this middleware with dependency injection and add it to the pipeline
/// (or use the provided extension) so that exceptions thrown by downstream components
/// are converted into an HTTP error response with content type "application/problem+json".
/// </remarks>
public class ErrorHandlingMiddleware : IMiddleware
{
   private readonly ILogger<ErrorHandlingMiddleware> _logger;
   private readonly IHostEnvironment _env;

   /// <summary>
   /// Creates a new instance of <see cref="ErrorHandlingMiddleware"/>.
   /// </summary>
   /// <param name="logger">Logger used to record unexpected errors.</param>
   /// <param name="env">Host environment used to decide how much error detail to expose.</param>
   public ErrorHandlingMiddleware(
       ILogger<ErrorHandlingMiddleware> logger,
       IHostEnvironment env)
   {
      _logger = logger;
      _env = env;
   }

   /// <summary>
   /// Invokes the middleware for a given HTTP context.
   /// </summary>
   /// <remarks>
   /// This method calls the next middleware in the pipeline inside a try/catch.
   /// If an exception is thrown, it will:
   ///  - log the exception,
   ///  - create a <see cref="ProblemDetails"/> instance describing the error,
   ///  - write the problem details as JSON using the "application/problem+json" content type,
   ///  - set the appropriate HTTP status code.
   ///
   /// The middleware intentionally avoids exposing sensitive exception details in
   /// non-development environments. Detailed exception messages are included only
   /// when the application is running in the Development environment.
   /// </remarks>
   /// <param name="context">Current HTTP context.</param>
   /// <param name="next">Delegate used to invoke the next middleware.</param>
   public async Task InvokeAsync(HttpContext context, RequestDelegate next)
   {
      try
      {
         await next(context);
      }
      catch (Exception ex)
      {
         // Log the full exception (message + stack trace). This log entry is useful
         // for diagnostics and should be captured by the configured logging provider.
         _logger.LogError(ex, "Unhandled exception occurred");

         // Create a standardized problem details response for the client.
         var problem = CreateProblemDetails(
             context,
             ex,
             HttpStatusCode.InternalServerError
         );

         // Set response headers and write JSON body. Using "application/problem+json"
         // follows RFC 7807 and makes it easier for HTTP clients to parse structured errors.
         context.Response.StatusCode = problem.Status ?? 500;
         context.Response.ContentType = "application/problem+json";

         var json = JsonSerializer.Serialize(problem);
         await context.Response.WriteAsync(json);
      }
   }

   /// <summary>
   /// Builds a <see cref="ProblemDetails"/> instance representing the given exception.
   /// </summary>
   /// <param name="context">Current HTTP context. Used to provide the request path as the instance.</param>
   /// <param name="ex">The exception that occurred.</param>
   /// <param name="statusCode">The HTTP status code to associate with the problem.</param>
   /// <returns>A <see cref="ProblemDetails"/> object describing the error.</returns>
   /// <remarks>
   /// The ProblemDetails object contains:
   ///  - Title: a user-friendly summary,
   ///  - Status: numeric HTTP status code,
   ///  - Instance: the request path where the error occurred,
   ///  - Type: a URI identifying the error type (here a generic 500 reference).
   ///
   /// Detailed exception text is included only when the host environment is Development
   /// to avoid leaking sensitive information in production.
   /// </remarks>
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

      // Include detailed exception info only in Development to avoid leaking internals.
      if (_env.IsDevelopment())
      {
         problem.Detail = ex.Message;
      }

      return problem;
   }
}
