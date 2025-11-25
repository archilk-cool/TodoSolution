import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "@/components/TaskItem";
import { format } from "date-fns";

/**
 * Unit tests for the TaskItem component.
 *
 * These tests validate rendering, user interactions and the component's
 * contract with its callbacks (onToggle, onEdit, onDelete).
 *
 * Test strategy:
 *  - Use a shared baseProps object for sensible defaults.
 *  - Provide a small setup helper that renders the component and returns helpers.
 *  - Reset mocks before each test to ensure isolation.
 *
 * Notes:
 *  - The tests rely on data-testid attributes exposed by the component to locate elements.
 *  - Dates are compared using the same formatting string the component uses to avoid locale issues.
 */
describe("TaskItem", () => {
   // Default props reused by tests; individual tests may override as needed.
   const baseProps = {
      id: 1,
      text: "Buy milk",
      description: "2% organic",
      dueDate: new Date("2030-01-01T10:00:00Z"),
      completed: false,
      onToggle: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
   };

   /**
    * Renders the component with baseProps merged with optional overrides.
    * Returns the props used and the testing-library utils from render.
    */
   function setup(overrides = {}) {
      const props = { ...baseProps, ...overrides };
      const utils = render(<TaskItem {...props} />);
      return { props, ...utils };
   }

   // Ensure mocks are cleared between tests to avoid cross-test interference.
   beforeEach(() => {
      jest.clearAllMocks();
   });

   /**
    * Verifies the component renders the title, description and a correctly formatted due date.
    * Uses the same date-fns format string as the component to assert equality.
    */
   test("renders title, description, and due date", () => {
      const due = new Date("2030-01-01T10:00:00Z");
      setup({ dueDate: due });

      // Title and description should be visible
      expect(
         screen.getByTestId("text-task-1")
      ).toHaveTextContent("Buy milk");
      expect(screen.getByText(/2% organic/i)).toBeInTheDocument();

      // Due date string should match the component's formatting
      const formatted = format(due, "MMM d, yyyy 'at' h:mm a");
      expect(screen.getByTestId("text-due-date-1")).toHaveTextContent(
         formatted
      );
   });

   /**
    * Ensures clicking the checkbox invokes the onToggle callback with the task id.
    */
   test("calls onToggle when checkbox is clicked", () => {
      setup();

      const checkbox = screen.getByTestId("checkbox-task-1");
      fireEvent.click(checkbox);

      // Expect the baseProps.onToggle mock to have been called once with the id
      expect(baseProps.onToggle).toHaveBeenCalledTimes(1);
      expect(baseProps.onToggle).toHaveBeenCalledWith(1);
   });

   /**
    * Opens edit mode, enters an invalid title and asserts the validation message is shown
    * and that the onEdit callback is not invoked for invalid input.
    */
   test("shows validation error if edited title is too short", () => {
      const onEdit = jest.fn();
      setup({ onEdit });

      // Open edit mode via the edit button (accessed by its accessible name)
      const editButton = screen.getByRole("button", { name: /edit task/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByTestId("input-edit-task-1");
      const saveButton = screen.getByTestId("button-save-edit-1");

      // Enter an invalid title and attempt to save
      fireEvent.change(titleInput, { target: { value: "Hi" } });
      fireEvent.click(saveButton);

      // Validation message should appear and onEdit should not be called
      expect(
         screen.getByText(/Title must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(onEdit).not.toHaveBeenCalled();
   });

   /**
    * Edits the task with valid values and asserts onEdit is called with the expected payload.
    * Verifies that the payload contains the updated text, description and a Date instance for dueDate.
    */
   test("calls onEdit with updated values on valid save", () => {
      const onEdit = jest.fn();
      setup({ onEdit });

      // Enter edit mode
      const editButton = screen.getByRole("button", { name: /edit task/i });
      fireEvent.click(editButton);

      // Get inputs and the save button
      const titleInput = screen.getByTestId("input-edit-task-1");
      const descInput = screen.getByTestId("input-edit-description-1");
      const dueInput = screen.getByTestId("input-edit-due-date-1");
      const saveButton = screen.getByTestId("button-save-edit-1");

      // Provide new valid values
      fireEvent.change(titleInput, { target: { value: "New title" } });
      fireEvent.change(descInput, { target: { value: "New description" } });
      fireEvent.change(dueInput, {
         target: { value: "2031-05-10T12:30" },
      });

      // Save changes
      fireEvent.click(saveButton);

      // onEdit should be called once with (id, payload)
      expect(onEdit).toHaveBeenCalledTimes(1);
      const [id, payload] = onEdit.mock.calls[0];
      expect(id).toBe(1);
      expect(payload.text).toBe("New title");
      expect(payload.description).toBe("New description");
      // dueDate should be converted to a Date instance by the component before calling onEdit
      expect(payload.dueDate).toBeInstanceOf(Date);
   });

   /**
    * Verifies clicking the delete button calls onDelete with the task id.
    */
   test("calls onDelete when delete button is clicked", () => {
      const onDelete = jest.fn();
      setup({ onDelete });

      const deleteButton = screen.getByRole("button", {
         name: /delete task/i,
      });
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(1);
   });
});
