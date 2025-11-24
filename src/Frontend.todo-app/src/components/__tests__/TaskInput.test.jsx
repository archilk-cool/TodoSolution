import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskInput from "@/components/TaskInput";

/**
 * Unit tests for the TaskInput component.
 *
 * These tests exercise client-side behavior only:
 *  - validation rules (title length)
 *  - calling the onAdd callback with the expected payload
 *
 * Tests follow the Arrange / Act / Assert pattern and use data-testid attributes
 * present on the component to locate inputs and buttons.
 */
describe("TaskInput", () => {
  test("shows validation error when title is too short", () => {
    // Arrange: create a spy for the onAdd handler and render the component
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    // Locate elements using data-testid attributes defined in the component
    const input = screen.getByTestId("input-new-task");
    const button = screen.getByTestId("button-add-task");

    // Act: type a too-short title and click the add button
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.click(button);

    // Assert:
    // - the component displays a client-side validation message about minimum length
    // - the onAdd handler is NOT called for invalid input
    expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  test("calls onAdd with valid data", () => {
    // Arrange: render component with a spy for the onAdd handler
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    // Locate input and button
    const input = screen.getByTestId("input-new-task");
    const button = screen.getByTestId("button-add-task");

    // Act: enter a valid title and submit
    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.click(button);

    // Assert:
    // - onAdd was called once
    // - payload contains at least the text property with the trimmed title
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Buy milk",
      })
    );
  });
});
