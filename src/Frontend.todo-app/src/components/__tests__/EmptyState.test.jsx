import React from "react";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/EmptyState";

/**
 * Tests for the EmptyState component.
 *
 * Purpose:
 *  - Verify the component shows the correct message for each filter state:
 *      • "all" — when there are no tasks at all
 *      • "active" — when no active tasks are present
 *      • "completed" — when no completed tasks are present
 *
 * Strategy:
 *  - Render the component with the appropriate filter prop.
 *  - Use accessible text assertions (regex / case-insensitive) to avoid brittle exact string checks.
 *  - Keep tests small and focused (one assertion group per filter).
 *
 * Notes:
 *  - The component exposes a data-testid "empty-state" used by tests to verify rendering.
 *  - These are fast, deterministic unit tests that don't require any external setup.
 */
describe("EmptyState", () => {
   test("shows correct message for 'all' filter", () => {
      // Arrange & Act: render component for "all"
      render(<EmptyState filter="all" />);

      // Assert: container present and expected messages visible
      const container = screen.getByTestId("empty-state");  
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
      expect(
         screen.getByText(/Add one to get started/i)
      ).toBeInTheDocument();
   });

   test("shows correct message for 'active' filter", () => {
      // Arrange & Act: render component for "active"
      render(<EmptyState filter="active" />);

      // Assert: messages appropriate for "active" filter
      expect(screen.getByText(/All done/i)).toBeInTheDocument();
      expect(
         screen.getByText(/Nothing active right now/i)
      ).toBeInTheDocument();
   });

   test("shows correct message for 'completed' filter", () => {
      // Arrange & Act: render component for "completed"
      render(<EmptyState filter="completed" />);

      // Assert: messages appropriate for "completed" filter
      expect(
         screen.getByText(/No completed tasks/i)
      ).toBeInTheDocument();
      expect(
         screen.getByText(/Complete a task to see it here/i)
      ).toBeInTheDocument();
   });
});
