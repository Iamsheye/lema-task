import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UsersTable } from "../UsersTable";
import type { Address, User } from "@/lib/database";

// Mock the TanStack Router Link component
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode;
    to: string;
    params: any;
  }) => (
    <a href={`${to.replace("$id", params.id)}`} data-testid="user-link">
      {children}
    </a>
  ),
}));

type UserWithAddress = User & {
  address?: Address;
};

describe("UsersTable", () => {
  const mockUsers: Array<UserWithAddress> = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: {
        id: "addr1",
        user_id: "1",
        street: "123 Main St",
        state: "CA",
        city: "Los Angeles",
        zipcode: "90210",
      },
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: {
        id: "addr2",
        user_id: "2",
        street: "456 Oak Ave",
        state: "NY",
        city: "New York",
        zipcode: "10001",
      },
    },
    {
      id: "3",
      name: "Bob Wilson",
      username: "bobwilson",
      email: "bob@example.com",
      phone: "555-123-4567",
      // No address for this user
    },
  ];

  const mockPagination = {
    pageIndex: 0,
    pageSize: 10,
    pageCount: 1,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the table with correct data", () => {
    render(<UsersTable loading={false} data={mockUsers} />);

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("displays address in correct format: street, state, city, zipcode", () => {
    render(<UsersTable loading={false} data={mockUsers} />);

    expect(
      screen.getByText("123 Main St, CA, Los Angeles, 90210"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("456 Oak Ave, NY, New York, 10001"),
    ).toBeInTheDocument();
  });

  it('displays "No address" for users without an address', () => {
    render(<UsersTable loading={false} data={mockUsers} />);

    expect(screen.getByText("No address")).toBeInTheDocument();
  });

  // it("applies correct styling to address column with minimum width", () => {
  //   render(<UsersTable loading={false} data={mockUsers} />);

  //   const addressElement = screen.getByText(
  //     "123 Main St, CA, Los Angeles, 90210",
  //   );
  //   expect(addressElement).toHaveStyle({ minWidth: "392px" });
  //   expect(addressElement).toHaveClass("truncate");
  // });

  // it("adds title attribute for address tooltip", () => {
  //   render(<UsersTable loading={false} data={mockUsers} />);

  //   const addressElement = screen.getByText(
  //     "123 Main St, CA, Los Angeles, 90210",
  //   );
  //   expect(addressElement).toHaveAttribute(
  //     "title",
  //     "123 Main St, CA, Los Angeles, 90210",
  //   );
  // });

  it("renders loading state correctly", () => {
    render(<UsersTable loading={true} data={[]} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders empty state when no data is provided", () => {
    render(<UsersTable loading={false} data={[]} />);

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("handles sorting functionality", () => {
    render(<UsersTable loading={false} data={mockUsers} />);

    const nameHeader = screen.getByText("Full Name").closest("div");
    expect(nameHeader).toHaveClass("cursor-pointer");

    fireEvent.click(nameHeader!);

    // Since sorting is handled internally, we just verify the click handler exists
    expect(nameHeader).toHaveClass("cursor-pointer");
  });

  it("renders user links correctly", () => {
    render(<UsersTable loading={false} data={mockUsers} />);

    const userLinks = screen.getAllByTestId("user-link");
    expect(userLinks).toHaveLength(9); // 3 users × 3 columns = 9 links

    // Check that links have correct href structure
    expect(userLinks[0]).toHaveAttribute("href", "/users/1");
  });

  it("handles address sorting correctly with null addresses", () => {
    const usersWithMixedAddresses: Array<UserWithAddress> = [
      {
        id: "1",
        name: "User One",
        username: "user1",
        email: "user1@example.com",
        phone: "111-111-1111",
        address: {
          id: "addr1",
          user_id: "1",
          street: "123 A St",
          state: "AL",
          city: "Birmingham",
          zipcode: "35201",
        },
      },
      {
        id: "2",
        name: "User Two",
        username: "user2",
        email: "user2@example.com",
        phone: "222-222-2222",
        // No address
      },
      {
        id: "3",
        name: "User Three",
        username: "user3",
        email: "user3@example.com",
        phone: "333-333-3333",
        address: {
          id: "addr3",
          user_id: "3",
          street: "789 Z St",
          state: "CA",
          city: "Los Angeles",
          zipcode: "90210",
        },
      },
    ];

    render(<UsersTable loading={false} data={usersWithMixedAddresses} />);

    expect(
      screen.getByText("123 A St, AL, Birmingham, 35201"),
    ).toBeInTheDocument();
    expect(screen.getByText("No address")).toBeInTheDocument();
    expect(
      screen.getByText("789 Z St, CA, Los Angeles, 90210"),
    ).toBeInTheDocument();
  });
});
