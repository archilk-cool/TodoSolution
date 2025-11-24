import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskInput from "@/components/TaskInput";

describe("TaskInput", () => {
  test("shows validation error when title is too short", () => {
    const onAdd = jest.fn();

    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByTestId("input-new-task");
    const button = screen.getByTestId("button-add-task");

    // Type a too-short title
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.click(button);

    // Should show validation error from client-side rules
    expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  test("calls onAdd with valid data", () => {
    const onAdd = jest.fn();

    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByTestId("input-new-task");
    const button = screen.getByTestId("button-add-task");

    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.click(button);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Buy milk",
      })
    );
  });
});
